type EnvironmentVariable = string | null | number | undefined;

function getEnvironmentVariable(
  environmentVariableName: string,
  fallback?: EnvironmentVariable,
): string {
  const environmentVariableValue = process.env[environmentVariableName];
  if (!environmentVariableValue) {
    if (fallback) return fallback.toString();
    throw new Error(`Missing environment variable: '${environmentVariableName}'`);
  }
  return environmentVariableValue;
}

export const config = {
  stage: getEnvironmentVariable('STAGE'),
  awsRegion: getEnvironmentVariable('AWS_REGION'),
  sentryDSN: getEnvironmentVariable('SENTRY_DSN'),
  environment: getEnvironmentVariable('NODE_ENV'),
  release: getEnvironmentVariable('CIRCLE_SHA1', 'no-release-hash-set'),
  privateKey: getEnvironmentVariable('PRIVATE_KEY'),
  signingSecret: getEnvironmentVariable('SIGNING_SECRET'),
};

export const applicationInterfaceKey = 'xj823lbq';
