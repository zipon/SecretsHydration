#!/opt/homebrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib/core';
import { Config, SECRET_NAMES } from '../lib/config';
import { SecretsHydrationStack } from '../lib/secrets-hydration-stack';
import { SecretsManagerStack } from '../lib/secrets-manager-stack';
const app = new cdk.App();
const secretsManagerStack = new SecretsManagerStack(app,`${Config.SECRETS_MANAGER_STACK_NAME}`,{secretNames: SECRET_NAMES});
new SecretsHydrationStack(app, 'SecretsHydration', { stackName: 'SecretsHydration' });
