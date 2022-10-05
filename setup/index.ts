import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import os from 'os'

function versionString (rawPlatform: string, rawArch: string, requestedVersion: string): string {
  let platform = ''
  switch (rawPlatform) {
    case 'linux': {
      platform = 'linux'
      break
    }
    default: {
      throw new Error(`platform ${rawPlatform} not supported`)
    }
  }
  let arch = ''
  switch (rawArch) {
    case 'x64': {
      arch = 'amd64'
      break
    }
    case 'arm': {
      arch = 'arm'
      break
    }
    case 'arm64': {
      arch = 'arm64'
      break
    }
    default: {
      throw new Error(`architecture ${rawArch} not supported`)
    }
  }

  return `v${requestedVersion}-${platform}-${arch}`
}

interface Input {
  version: string
}

function getInput (): Input {
  const version = core.getInput('version')
  if (version === '') {
    throw new Error("'version' input must be non-empty")
  }

  return {
    version
  }
}

const toolName = 'teleport'

async function run (): Promise<void> {
  const input = getInput()
  const version = versionString(os.platform(), os.arch(), input.version)
  core.info(`Installing Teleport ${version}`)

  const toolPath = tc.find(toolName, version)
  if (toolPath !== '') {
    core.info('Teleport binaries found in cache.')
    core.addPath(toolPath)
    return
  }

  core.info('Could not find Teleport binaries in cache. Fetching...')
  const downloadPath = await tc.downloadTool(`https://get.gravitational.com/teleport-${version}-bin.tar.gz`)
  const extractedPath = await tc.extractTar(downloadPath)
  core.info('Writing Teleport binaries back to cache...')
  const cachedPath = await tc.cacheDir(extractedPath, toolName, version)
  core.addPath(cachedPath)
}
run().catch((error) => {
  core.setFailed(error.message)
})
