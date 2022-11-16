import path from 'path';

import * as core from '@actions/core';

import { stringify } from 'yaml';

import * as tbot from '../lib/tbot';
import * as io from '../lib/io';

interface Inputs {
  kubernetesCluster: string;
}

function getInputs(): Inputs {
  return {
    kubernetesCluster: core.getInput('kubernetes-cluster', {
      required: true,
    }),
  };
}

async function run() {
  const inputs = getInputs();
  const sharedInputs = tbot.getSharedInputs();
  const config = tbot.baseConfigurationFromSharedInputs(sharedInputs);

  // TODO(strideynet): consider if we want to make this use a temp dir instead
  const destinationPath = await io.makeTempDirectory();
  config.destinations.push({
    directory: {
      path: destinationPath,
    },
    roles: [], // Use all assigned to bot,
    kubernetes_cluster: inputs.kubernetesCluster,
  });

  const configPath = await tbot.writeConfiguration(config);

  core.info('Invoking tbot with configuration at ' + configPath);
  core.info('Credentials will be output to ' + destinationPath);
  core.debug('tbot configuration:\n' + stringify(config));
  await tbot.execute(configPath);

  core.exportVariable(
    'KUBECONFIG',
    path.join(destinationPath, '/kubeconfig.yaml')
  );
}
run().catch(core.setFailed);
