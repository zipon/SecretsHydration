import { Stack, Tags, StackProps, CfnOutput, RemovalPolicy, SecretValue } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as kms from "aws-cdk-lib/aws-kms";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Config, EnvName, branchToEnv } from './config';

export interface SecretsManagerStackProps extends StackProps {
  secretNames: string[];
}

export class SecretsManagerStack extends Stack {
  /** Export all created secrets by name */
  public readonly kmsKey: kms.Key;

  constructor(scope: Construct, id: string, props: SecretsManagerStackProps) {
    super(scope, id, props);
    // Tags
    Tags.of(this).add('costTag-project', Config.COST_TAG_PROJECT);
    Tags.of(this).add('costTag-module', Config.COST_TAG_MODULE);
    Tags.of(this).add('costTag-submodule', Config.COST_TAG_SUBMODULE_STACK_TWO);
    Tags.of(this).add('costTag-resource', Config.COST_TAG_RESOURCE);
    Tags.of(this).add('managedBy', Config.MANAGED_BY);
    Tags.of(this).add('backup-required', Config.BACKUP_REQUIRED);


    // Deployment info from context values (optional)
    const gitCommit = this.node.tryGetContext('gitCommit') as string | undefined;
    const repoName = this.node.tryGetContext('repoName') as string | undefined;
    const branch = this.node.tryGetContext('branchName') as string | undefined;

    // Builds the deployments info and if it is not deployed from GitHub action it will be Manually deployed
    const rawBranch: string = branch ?? "dev-manual";
    const deployInfo = (gitCommit && repoName && branch)
     ? `${repoName} (${branch}) @ ${gitCommit.substring(0, 7)}`
     : 'Manually deployed';

    // Map arbitrary branch names EnvName union
    const envName: EnvName = branchToEnv(branch ?? Config.ENV); // 'develop' | 'stage' | 'prod'

     this.kmsKey = new kms.Key(this, "SecretKmsKey", {
      alias: `${id.toLowerCase()}-kms-${envName}`,
      enableKeyRotation: true,
      description: "KMS key for encrypting application secrets",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, 'DeploymentInfo', {value: deployInfo, description: 'Source of this deployment (repo, branch, commit) or manual deploy marker'});
    new CfnOutput(this, "SecretsKmsKeyArn", { value: this.kmsKey.keyArn });

    for (const baseName of props.secretNames) {
      const finalName = this.buildSecretName(baseName, envName); // e.g. "app-credentials-develop"
      const logicalId = this.toLogicalId(finalName);

      const secret = new secretsmanager.Secret(this, `Secret-${logicalId}`, {
        secretName: finalName,
        description: `Managed secret: ${finalName}`,
        encryptionKey: this.kmsKey,
        removalPolicy: RemovalPolicy.DESTROY,
        //CI will overwrite
        secretObjectValue: {
          username: SecretValue.unsafePlainText(""),
          password: SecretValue.unsafePlainText(""),
        },
      });

      // Keep track of them in a map
      //this.secrets[finalName] = secret;

      // Useful outputs
      new CfnOutput(this, `SecretArn-${logicalId}`, { value: secret.secretArn });
      new CfnOutput(this, `SecretName-${logicalId}`, { value: secret.secretName });
    }
  }

  /** Avoid double-appending if base already ends with an env suffix. */
  private buildSecretName(base: string, env: "develop" | "stage" | "prod"): string {
    const suffixes = ["develop", "stage", "prod"];
    return suffixes.some(s => base.endsWith(`-${s}`)) ? base : `${base}-${env}`;
  }

  /**
   * Replace any invalid CloudFormation ID characters with dashes for logical IDs.
   */
  private toLogicalId(secretName: string): string {
    return secretName.replace(/[^A-Za-z0-9]/g, "-");
  }
}
