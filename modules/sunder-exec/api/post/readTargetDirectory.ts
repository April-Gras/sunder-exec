import { PostValidator, PostHandler } from "../../routes/index"
import { getContentFromDirectoryPath } from "../fileReadingUtils"

export default {
  routeUrl: "/readTargetDirectory" as const,
  validator: function (value) {
    return (
      value !== undefined &&
      value instanceof Object &&
      typeof value.targetDirectory === "string"
    )
  } as PostValidator<"/readTargetDirectory">,
  handler: function (value) {
    return new Promise((resolve) => {
      getContentFromDirectoryPath(
        value.targetDirectory,
        this.runtimeConfig.extentionMapping
      )
        .then((value) => {
          resolve({
            err: null,
            value,
          })
        })
        .catch(() => {
          resolve({
            value: null,
            err: {
              statusCode: 404,
              message: "Directory probably not in config",
            },
          })
        })
    })
  } as PostHandler<"/readTargetDirectory">,
} as const
