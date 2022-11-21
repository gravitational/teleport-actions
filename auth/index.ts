import path from 'path';

import * as core from '@actions/core';

import * as tbot from '../lib/tbot';
import * as io from '../lib/io';

async function run() {
  const sharedInputs = tbot.getSharedInputs();
  const config = tbot.baseConfigurationFromSharedInputs(sharedInputs);

  const destinationPath = await io.makeTempDirectory();
  config.destinations.push({
    directory: {
      path: destinationPath,
    },
    roles: [], // Use all assigned to bot,
  });

  const configPath = await tbot.writeConfiguration(config);
  await tbot.execute(configPath);
  core.setOutput('identity-file', path.join(destinationPath, 'identity'));
}
run().catch(core.setFailed);
