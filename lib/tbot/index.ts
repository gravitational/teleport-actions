import * as core from '@actions/core';

// See https://github.com/gravitational/teleport/blob/master/lib/tbot/config/config.go#L206
// For configuration references

export interface ConfigurationV1Destination {
  directory: {
    path: string;
  };
  roles: Array<string>;
  kubernetes_cluster?: string;
}
export interface ConfigurationV1 {
  auth_server: string;
  oneshot: boolean;
  debug: boolean;
  onboarding: {
    join_method: string;
    token: string;
  };
  storage: {
    memory?: boolean;
    directory?: string;
  };
  destinations: Array<ConfigurationV1Destination>;
}

export interface SharedInputs {
  proxy: string;
  token: string;
  debug: boolean;
}

export function getSharedInputs(): SharedInputs {
  const proxy = core.getInput('proxy', { required: true });
  const token = core.getInput('token', { required: true });

  return {
    proxy,
    token,
    debug: core.isDebug(),
  };
}

export function baseConfigurationFromSharedInputs(
  inputs: SharedInputs
): ConfigurationV1 {
  return {
    auth_server: inputs.proxy,
    oneshot: true,
    debug: inputs.debug,
    onboarding: {
      join_method: 'github',
      token: inputs.token,
    },
    storage: {
      // We use memory storage here so we avoid ever writing the bots more
      // powerful credentials to disk.
      memory: true,
    },
    destinations: [],
  };
}

export function writeConfiguration(config: ConfigurationV1): string {
  core.info('writing config to, with values' + config);
  return ''; // This will eventually be the path to the config to pass into execute
}

export async function execute(configPath: string) {
  core.info('here we will run tbot --oneshot w/ ' + configPath);
}
