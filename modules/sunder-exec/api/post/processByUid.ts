import { readFile } from "fs"
import consola from "consola"
import { PostHandler, PostValidator } from "../../routes/index"

export default {
  routeUrl: "/processByUid",
  validator: function (value) {
    return typeof value === "object" && typeof value.uid === "string"
  } as PostValidator<"/processByUid">,
  handler: function ({ uid }) {
    return new Promise((resolve) => {
      const process = this.processPool.findProcessByUid(uid)

      if (process) {
        readFile(process.logFilePath, { encoding: "utf-8" }, (err, text) => {
          if (err)
            consola.warn(
              `[API processByUid] - could not retrieve logs for ${process.logFilePath}`
            )
          resolve({
            err: null,
            value: {
              process: process.getInfos,
              logs: {
                ...process.processLogBaseObject,
                text,
                type: "out", // We loose some truth to the log type here :<
              },
            },
          })
        })
      } else
        resolve({
          err: {
            statusCode: 404,
            message: "Process not found",
          },
          value: null,
        })
    })
  } as PostHandler<"/processByUid">,
}
