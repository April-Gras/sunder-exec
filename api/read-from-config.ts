import { ServerMiddleware } from '@nuxt/types'
import runtimeConfiguration from '../runtimeConfiguration'
import { getContentFromDirectoryPath, TargetsApiResponse } from '../helpers/server/fileApi'

const readFromConfigMiddleware: ServerMiddleware = function (_req, res) {
  const { targetDirectories, extentionMapping } = runtimeConfiguration

  Promise.allSettled(
    targetDirectories.map((directoryPath) => {
      return getContentFromDirectoryPath(directoryPath, extentionMapping)
    })
  ).then((promiseReturns) => {
    const apiReturn: TargetsApiResponse = promiseReturns.reduce((accumulator, response) => {
      if (response.status === 'fulfilled') {
        accumulator.push(response.value)
      } else {
        console.warn(`[WARN] - Failed to read a directory from the config:\n${response.reason}`)
      }
      return accumulator
    }, [] as TargetsApiResponse)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(apiReturn))
  })
}

export default readFromConfigMiddleware
