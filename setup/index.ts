import os from 'os';

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

function getPlatform(rawPlatform: string): string {
  switch (rawPlatform) {
    case 'linux': {
      return 'linux';
    }
  }
  throw new Error(`platform ${rawPlatform} not supported`);
}

function getArch(rawArch: string): string {
  switch (rawArch) {
    case 'x64': {
      return 'amd64';
    }
    case 'arm': {
      return 'arm';
    }
    case 'arm64': {
      return 'arm64';
    }
  }
  throw new Error(`architecture ${rawArch} not supported`);
}

/**
 * versionString converts a requested version, OS and architecture to a format
 * which can be used to fetch a bundle from the Teleport download site.
 */
function versionString(
  rawPlatform: string,
  rawArch: string,
  version: string
): string {
  const platform = getPlatform(rawPlatform);
  const arch = getArch(rawArch);

  return `v${version}-${platform}-${arch}`;
}

interface Input {
  version: string;
}

function getInput(): Input {
  const version = core.getInput('version');
  if (version === '') {
    throw new Error("'version' input must be non-empty");
  }
  if (version.startsWith('v')) {
    throw new Error("'version' input should not be prefixed with 'v'");
  }

  return {
    version,
  };
}

const toolName = 'teleport';

async function run(): Promise<void> {
  const input = getInput();
  const version = versionString(os.platform(), os.arch(), input.version);
  core.info(`Installing Teleport ${version}`);

  const toolPath = tc.find(toolName, version);
  if (toolPath !== '') {
    core.info('Teleport binaries found in cache.');
    core.addPath(toolPath);
    return;
  }

  core.info('Could not find Teleport binaries in cache. Fetching...');
  core.debug('Downloading tar');
  const downloadPath = await tc.downloadTool(
    `https://get.gravitational.com/teleport-${version}-bin.tar.gz`
  );

  core.debug('Extracting tar');
  const extractedPath = await tc.extractTar(downloadPath, undefined, [
    'xz',
    '--strip',
    '1',
  ]);

  core.info('Fetched binaries from Teleport. Writing them back to cache...');
  const cachedPath = await tc.cacheDir(extractedPath, toolName, version);
  core.addPath(cachedPath);
}
run().catch(core.setFailed);
