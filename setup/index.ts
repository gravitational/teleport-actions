import * as core from '@actions/core'

async function run (): Promise<void> {
  core.debug('This test worked...')
}
run().catch((error) => {
  core.setFailed(error.message)
})
