import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import os from 'os'

async function run (): Promise<void> {
  core.info('This test worked...')
  const teleportToolName = 'teleport'
  const version = '10.3.1'
  const detectedArch = os.arch()
  core.info(`Installing Teleport ${version} for ${detectedArch}`)

  // TODO: Fetch the real arch.
  // We probably only need to handle amd64 for GitHub provided runners.
  const arch = 'amd64'

  const toolPath = tc.find(teleportToolName, version, arch)
  if (toolPath !== '') {
    core.info('Teleport binaries found in cache.')
    core.addPath(toolPath)
    return
  }

  core.info('Could not find Teleport binaries in cache. Fetching...')
  const downloadPath = await tc.downloadTool(`https://get.gravitational.com/teleport-v${version}-linux-amd64-bin.tar.gz`)
  const extractedPath = await tc.extractTar(downloadPath)
  core.info('Writing Teleport binaries back to cache...')
  const cachedPath = await tc.cacheDir(extractedPath, teleportToolName, version, arch)
  core.addPath(cachedPath)
}
run().catch((error) => {
  core.setFailed(error.message)
})
