#!/opt/homebrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib/core';
import { SecretsHydrationStack } from '../lib/secrets-hydration-stack';
const app = new cdk.App();
new SecretsHydrationStack(app, 'SecretsHydration', { stackName: 'SecretsHydration' });
