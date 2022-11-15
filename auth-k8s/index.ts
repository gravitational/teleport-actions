import * as core from '@actions/core';

import * as tbot from '../lib/tbot';

async function run() {
  tbot.foo();
}
run().catch(core.setFailed);
