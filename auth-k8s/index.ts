import path from 'path';

import * as core from '@actions/core';

import { stringify } from 'yaml';

import * as tbot from '../lib/tbot';

async function run() {
  const sharedInputs = tbot.getSharedInputs();
  const config = tbot.baseConfigurationFromSharedInputs(sharedInputs);

  // TODO(strideynet): consider if we want to make this use a temp dir instead
  const destinationPath = '/opt/machine-id-kube-dest';
  config.destinations.push({
    directory: {
      path: destinationPath,
    },
    roles: [], // Use all assigned to bot,
    kubernetes_cluster: 'foo-bar-bizz',
  });

  const configPath = await tbot.writeConfiguration(config);

  core.info('Invoking tbot with configuration at ' + configPath);
  core.info('Credentials will be output to ' + destinationPath);
  core.debug(stringify(config));
  await tbot.execute(configPath);

  core.exportVariable(
    'KUBE_CONFIG',
    path.join(destinationPath, '/kubeconfig.yaml')
  );
}
run().catch(core.setFailed);
