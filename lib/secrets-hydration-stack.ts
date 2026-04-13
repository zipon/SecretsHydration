import * as cdk from 'aws-cdk-lib/core';
import { Stack, StackProps, CfnOutput, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Config } from './config';

export class SecretsHydrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Tags
    Tags.of(this).add('costTag-project', Config.COST_TAG_PROJECT);
    Tags.of(this).add('costTag-module', Config.COST_TAG_MODULE);
    Tags.of(this).add('costTag-submodule', Config.COST_TAG_MODULE);
    Tags.of(this).add('costTag-resource', Config.COST_TAG_RESOURCE);
    Tags.of(this).add('managedBy', Config.MANAGED_BY);
    Tags.of(this).add('backup-required', Config.BACKUP_REQUIRED);

    // Deployment info from context values (optional)
    const gitCommit = this.node.tryGetContext('gitCommit') as string | undefined;
    const repoName = this.node.tryGetContext('repoName') as string | undefined;
    const branch = this.node.tryGetContext('branchName') as string | undefined;

    // Builds the deployments info and if it is not deployed from GitHub action it will be Manually deployed
    const deployInfo = (gitCommit && repoName && branch)
     ? `${repoName} (${branch}) @ ${gitCommit.substring(0, 7)}`
     : 'Manually deployed';

    const rawBranch: string = branch ?? "dev-manual";
    const branchName: string = rawBranch === "main" || rawBranch === "master" ? "prod" : rawBranch;

    // The code that defines your stack goes here

    new CfnOutput(this, 'DeploymentInfo', {
        value: deployInfo,
        description: 'Source of this deployment (repo, branch, commit) or manual deploy marker'
    });
  }
}
