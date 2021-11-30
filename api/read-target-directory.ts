import { ServerMiddleware } from "@nuxt/types"
import runtimeConfiguration from "../runtimeConfiguration"
import {
  getContentFromDirectoryPath,
  TargetsApiResponse,
  DirectoryPath,
} from "../helpers/server/fileApi"

const readTargetDirectory: ServerMiddleware = function (req, res) {
  const bufferArray: any[] = []
  req
    .on("data", (chunk) => {
      bufferArray.push(chunk)
    })
    .on("end", () => {
      const body = JSON.parse(Buffer.concat(bufferArray).toString())

      if (bodyIsValid(body)) {
        getContentFromDirectoryPath(
          body.directoryPath,
          runtimeConfiguration.extentionMapping
        )
          .then((resp) => {
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(resp))
          })
          .catch(() => {
            res.statusCode = 404
            res.statusMessage =
              "Fuck you looser but my code is probably at fault and not the config"
            res.end()
          })
      } else {
        res.statusCode = 404
        res.statusMessage = "Fuck you looser"
        res.end()
      }
    })
}

function bodyIsValid(body: any): body is { directoryPath: DirectoryPath } {
  if (typeof body === "object") {
    return typeof body.directoryPath === "string"
  } else {
    return false
  }
}

export default readTargetDirectory
