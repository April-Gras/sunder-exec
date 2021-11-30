import path from "path"
import fs from "fs"
import { PostHandler, PostValidator } from "../routes"

// @ts-ignore
export const postReadTargetDirectoryValidator: PostValidator<"/readTargetDirectory"> =
  function (value) {
    return (
      value &&
      value instanceof Object &&
      typeof value.directoryPath === "string" &&
      typeof value.fileName === "string"
    )
  }

export const postReadTargetDirectoryHandler: PostHandler<"/readTargetDirectory"> =
  function (value) {
    const cleanedDirectoryPath = path.normalize(value.directoryPath)
    const cleanedFileName = path.normalize(value.fileName)
    const fullPath = path.join(cleanedDirectoryPath, cleanedFileName)

    // check if part of the config
    if (this.runtimeConfig.targetDirectories.includes(cleanedDirectoryPath)) {
      this.server.
    } else {
      const message = "Could not find directory"
      this.server.res.statusCode = 404
      this.server.res.statusMessage = message
      this.server.res.end(message)
    }
  }
