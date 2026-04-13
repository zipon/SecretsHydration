# Traceability

**End-to-end traceability for AWS CDK deployments**  
_Git → GitHub Actions → CDK → CloudFormation_

## Why this project exists

If you’ve ever opened a legacy AWS account and found a CloudFormation stack named something like:

> `PinkFluffyUnicornsDancingOnRainbows`

you’ve probably asked yourself:

- Which git project owns this stack?
- Which branch and commit produced it?
- Was it deployed manually or via CI/CD?
- Is this stack still relevant — or safe to delete?

In many environments, the answers to these questions are lost over time.

This project demonstrates a simple, reusable pattern for **full end-to-end traceability** between:
- Git repositories
- CI/CD pipelines (GitHub Actions)
- AWS CDK
- CloudFormation stacks and outputs

The goal is to make it obvious — directly in the AWS console — **where a stack came from and how it was deployed**.

---

## What this project shows

This repository demonstrates:

- Manual vs CI/CD deployment detection
- Passing git metadata into CDK using context
- Exposing traceability via:
  - CloudFormation outputs
  - (Optionally) tags
- Using GitHub Actions with OIDC (no long-lived AWS credentials)
- Reusable GitHub Actions workflows for CDK deployments
- How confusing stack names stop being a problem when traceability exists

---

## Traceability data captured

When deployed via GitHub Actions, the following information is passed into CDK:

- **Repository name**
- **Branch name**
- **Git commit SHA**
- **Deployment source** (manual vs GitHub Actions)

Example CloudFormation output:

zipon/Traceability (develop) @ e1acbc0

## Article

Read the full write-up on Medium:  
[Where the hell is the git project that owns this?](https://lars-andersson.medium.com/where-the-hell-is-the-git-project-that-owns-this-550bd96dd230)

## License

This project is licensed under the **Beer-Ware License**.  
If you use it and we ever meet, you owe me a beer 🍺
