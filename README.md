# SecretsHydration

**One-run secrets recovery for AWS CDK deployments**  
_Git -> GitHub Actions -> CDK -> CloudFormation -> Secrets hydration_

## Why this project exists

If you've ever deployed infrastructure into a fresh AWS account and watched the run fail because a secret did not exist yet, you already know the problem.

The usual dance looks something like this:

1. Deploy the stack.
2. Watch it fail because the secret is missing.
3. Open AWS Secrets Manager manually.
4. Create the secret by hand.
5. Paste the values from somewhere else.
6. Re-run the deployment.

That is not infrastructure as code. That is infrastructure as long as Dave is awake.

This project demonstrates a simple, reusable pattern for removing that manual checkpoint from AWS CDK deployments.

The goal is to make recovery and fresh-account deployment feel like one run instead of two runs plus one tired human.

---

## What this project shows

This repository demonstrates:

- Creating secret containers in AWS Secrets Manager with CDK
- Creating a dedicated KMS key for those secrets
- Using GitHub Actions with OIDC instead of long-lived AWS credentials
- Hydrating AWS secrets from GitHub environment secrets
- Sequencing deployments so secrets exist before the rest of the stacks consume them
- Carrying forward deployment metadata such as repo, branch, and commit through CDK context and CloudFormation output
- A practical path toward single-run disaster recovery in a fresh AWS account

---

## The core pattern

The pattern is simple:

1. Deploy the secrets stack first.
2. Let CDK create the secret placeholders and KMS key.
3. Hydrate those secrets from GitHub environment secrets.
4. Deploy the rest of the stacks after the secrets exist.

In short:

`create the secret first -> hydrate the secret second -> consume the secret third`

That middle step is the whole point.

---

## What this project depends on

The important prerequisites are operational rather than historical:

- An AWS account and region to deploy into
- A GitHub repository with Actions enabled
- An AWS IAM role for GitHub OIDC
- GitHub environment variables such as `AWS_ACCOUNT_ID`, `AWS_ROLE_NAME`, and `AWS_REGION`
- GitHub environment secrets that hold the bootstrap secret values for each environment

This repository stands on its own.

It draws from the same deployment structure as `Traceability`, but you do not need that older project checked out locally to understand or run this one.

---

## Why GitHub environment secrets are used

This pattern works best when the source secrets are environment-specific.

GitHub environment secrets make it possible to separate `develop`, `stage`, and `prod`, while still using GitHub Actions and OIDC to move the values into AWS Secrets Manager at deploy time.

That gives you a sane split:

- GitHub stores the bootstrap values per environment
- AWS Secrets Manager stores the runtime secrets in the target AWS account

---

## What happens after hydration

Once the secret has been hydrated, the rest of the system can consume it in different ways:

- Runtime consumption, where applications or jobs read the secret directly from Secrets Manager when they run
- Deploy-time consumption, where CloudFormation dynamic references resolve secret values during deployment

Same hydrated secret. Two different consumption models. Same pipeline.

---

## Disaster recovery angle

This is really a disaster recovery project disguised as a secrets project.

Without hydration in the pipeline, recovery into a fresh AWS account often means:

`deploy -> fail -> create secrets manually -> re-run`

With hydration in the pipeline, the recovery flow becomes:

`assume role -> create secret resources -> hydrate secrets -> deploy the rest`

That gets you much closer to a real single-run recovery path.

---

## Article

Read the full write-up on Medium:  
_Link to be added when the article is published._

Article title:  
**How the hell did Dave put the secrets in a fresh AWS account in the first place?**

---

## License

This project is licensed under the **Beer-Ware License**.  
If you use it and we ever meet, you owe me a beer.
