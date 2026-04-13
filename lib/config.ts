export type EnvName = "develop" | "stage" | "prod";
export const Config = {
  COST_TAG_PROJECT: 'SecretsHydration',
  COST_TAG_MODULE: 'SecretsHydration-demo',
  COST_TAG_SUBMODULE: 'SecretsHydration-submodule',
  COST_TAG_SUBMODULE_STACK_TWO: 'secrets-stack-submodule',
  COST_TAG_RESOURCE: 'present-SecretsHydration',
  MANAGED_BY: 'Lars Andersson',
  BACKUP_REQUIRED: 'no',

  SECRETS_MANAGER_STACK_NAME: 'SecretsHydrationSecretsManager',
  SECRET_LARS_ANDERSSON: "secrets-hydration-poc-lars-andersson", // Secrets Manager secret (name) holding your xoxb- token.
  ENV: "develop" as EnvName,
};
// A list of base secret names shared by all environments
export const SECRET_NAMES: string[] = [
  Config.SECRET_LARS_ANDERSSON,
];
export const branchToEnv = (branch?: string): EnvName => {
  switch (branch) {
    case 'main':
    case 'master':
    case 'prod':
      return 'prod';
    case 'stage':
    case 'staging':
      return 'stage';
    case 'develop':
    case 'dev':
    default:
      return 'develop';
  }
};