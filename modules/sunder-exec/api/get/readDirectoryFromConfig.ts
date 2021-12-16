import consola from "consola"
import { getContentFromDirectoryPath } from "../fileReadingUtils"
import { GetHandler, GetPayloadReturnDescriptor } from "../../routes/index"

type ExpectedReturn = GetPayloadReturnDescriptor["/readDirectoryFromConfig"]

export default {
  routeUrl: "/readDirectoryFromConfig" as const,
  handler: function () {
    return new Promise((resolve) => {
      const { targetDirectories } = this.runtimeConfig

      Promise.allSettled(
        targetDirectories.map((directoryPath) => {
          return getContentFromDirectoryPath(
            directoryPath,
            this.runtimeConfig.extentionMapping
          )
        })
      ).then((promiseReturns) => {
        const apiReturn: ExpectedReturn = promiseReturns.reduce(
          (accumulator, response) => {
            if (response.status === "fulfilled") {
              accumulator.push(response.value)
            } else {
              consola.warn(
                `[WARN] - Failed to read a directory from the config:\n${response.reason}`
              )
            }
            return accumulator
          },
          [] as ExpectedReturn
        )

        resolve({
          err: null,
          value: apiReturn,
        })
      })
    })
  } as GetHandler<"/readDirectoryFromConfig">,
}
