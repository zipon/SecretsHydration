# SecretsHydration

**Continuation of the Traceability seed project**  
_Git -> GitHub Actions -> CDK -> CloudFormation -> Secrets hydration_

## Why this project exists

This project does not start from a blank CDK template.

It starts from the **Traceability** project and uses that stack as the seed:

- Git metadata passed into CDK
- deployment traceability via CloudFormation output
- manual vs CI/CD deployment detection
- GitHub Actions and OIDC as the deployment pattern

Traceability solved one problem well:

> When you open an AWS account, can you tell which git project, branch, and commit deployed the stack?

This project continues with the next problem:

> When the AWS account is fresh and the secrets are empty, how do we create and hydrate secrets without stopping the deployment and doing it manually?

That is the purpose of `SecretsHydration`.

## What this project is about

The goal here is to extend the Traceability pattern into **Secrets Manager hydration**.

The problem we want to solve is the manual break in many so-called automated deployments:

1. Deploy the stack.
2. Watch it fail because the secret does not exist or has no value.
3. Open AWS Secrets Manager manually.
4. Paste the secret values by hand.
5. Re-run the deployment.

That is exactly the step we want to remove.

This project is intended to show how to:

- create secret containers in AWS with CDK
- hydrate those secrets from GitHub environment secrets
- continue the deployment without a manual stop
- support a better one-run recovery flow for a fresh AWS account

## Traceability seed

This repository still carries the Traceability foundation on purpose.

The current stack keeps the same core behavior:

- tags resources with project metadata
- emits deployment information as CloudFormation output
- accepts `repoName`, `branchName`, and `gitCommit` through CDK context
- falls back to `Manually deployed` when no CI/CD metadata is provided

That means the repo starts from a known and already explained base instead of rebuilding the deployment story from zero.

## What comes next

The next step in this project is to build the secrets hydration flow on top of that seed:

1. Deploy the secrets stack first.
2. Create the secret resources in AWS Secrets Manager.
3. Hydrate them from GitHub environment secrets in GitHub Actions.
4. Let the rest of the stacks consume those secrets.

This is the missing bridge between:

- **traceability**: knowing who deployed what
- **recoverability**: being able to stand up the account and continue without waiting for a manual secrets step

## Previous article

The seed project and the thinking behind the traceability part are described here:

[Where the hell is the git project that owns this?](https://lars-andersson.medium.com/where-the-hell-is-the-git-project-that-owns-this-550bd96dd230)

This repository is the follow-up path from that article into secrets hydration.

## License

This project is licensed under the **Beer-Ware License**.  
If you use it and we ever meet, you owe me a beer.
