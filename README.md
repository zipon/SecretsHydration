# SecretsHydration

_Git -> GitHub Actions -> CDK -> CloudFormation -> Secrets hydration_

## What This Project Is

`SecretsHydration` is a small CDK project that demonstrates a one-run secrets recovery pattern:

1. Deploy a dedicated secrets stack first.
2. Let CDK create the KMS key and Secrets Manager secret containers.
3. Hydrate those secrets from GitHub environment secrets in GitHub Actions.
4. Deploy the remaining stacks after the secrets exist.

The goal is to remove the manual "deployment failed because the secret is missing" checkpoint from recovery and fresh-account deployments.

## What This Repository Does Today

This repository stands on its own on the `develop` branch.

You do not need a local copy of the `Traceability` project to understand or run it.
What this repo keeps from that earlier work is the deployment metadata pattern:

- Git metadata passed into CDK through context
- a `DeploymentInfo` CloudFormation output
- manual vs CI/CD deployment detection
- GitHub Actions with AWS OIDC role assumption

So `Traceability` is background context, not a technical prerequisite for this repo.

## Optional Background Reading

If you want the earlier story behind the deployment metadata pattern, that article is here:

[Where the hell is the git project that owns this?](https://lars-andersson.medium.com/where-the-hell-is-the-git-project-that-owns-this-550bd96dd230)

Read it for background if useful, but this repository is meant to be understandable without it.

## Real Prerequisites

To make this project work, the important prerequisites are operational rather than historical:

- an AWS account and region to deploy into
- a GitHub repository with Actions enabled
- a GitHub OIDC role in AWS that the workflow can assume
- GitHub environment variables such as `AWS_ACCOUNT_ID`, `AWS_ROLE_NAME`, and `AWS_REGION`
- GitHub environment secrets for the payload values that will be written into AWS Secrets Manager

## Project Flow

The current flow in this repo is:

1. `main.yml` deploys `SecretsHydrationSecretsManagerStack` first.
2. `populate-secrets.yml` writes the environment-specific values into the created secret.
3. `main.yml` deploys the remaining stacks after hydration.

That sequence is the main point of the project:

- create the secret first
- hydrate the secret second
- consume the secret third

## What To Watch For

There are a few PoC choices in the current repo that you would likely harden before production:

- KMS keys and secrets currently use `RemovalPolicy.DESTROY`
- the example workflow currently shows the `develop` path in `main.yml`
- the placeholder secret object in CDK and the hydrated JSON payload should stay intentionally aligned and documented


## License

This project is licensed under the **Beer-Ware License**.  
If you use it and we ever meet, you owe me a beer.
