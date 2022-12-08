import path from 'path';

import * as core from '@actions/core';

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
  core.warning(
    'This action has moved from https://github.com/gravitational/teleport-actions to https://github.com/teleport-actions/auth-k8s . Please update your workflow!'
  );

  const inputs = getInputs();
  const sharedInputs = tbot.getSharedInputs();
  const config = tbot.baseConfigurationFromSharedInputs(sharedInputs);

  // Inject a destination for the Kubernetes cluster credentials
  const destinationPath = await io.makeTempDirectory();
  config.destinations.push({
    directory: {
      path: destinationPath,
    },
    roles: [], // Use all assigned to bot,
    kubernetes_cluster: inputs.kubernetesCluster,
  });

  const configPath = await tbot.writeConfiguration(config);
  await tbot.execute(configPath);

  core.exportVariable(
    'KUBECONFIG',
    path.join(destinationPath, '/kubeconfig.yaml')
  );
}
run().catch(core.setFailed);
