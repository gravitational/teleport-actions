import * as core from '@actions/core';

import * as tbot from '../lib/tbot';

async function run() {
  const sharedInputs = tbot.getSharedInputs();
  const config = tbot.baseConfigurationFromSharedInputs(sharedInputs);

  config.destinations.push({
    directory: {
      path: '/kube/config/dir',
    },
    roles: [], // Use all assigned to bot,
    kubernetes_cluster: 'foo-bar-bizz',
  });

  const configPath = tbot.writeConfiguration(config);
  await tbot.execute(configPath);
}
run().catch(core.setFailed);
