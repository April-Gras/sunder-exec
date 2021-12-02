import {
  PostHandler,
  PostValidator,
  evaluateIfFailure,
} from "../../routes/index"

export default {
  routeUrl: "/execTargetContext" as const,
  validator: function (value: any): boolean {
    return (
      value !== undefined &&
      value instanceof Object &&
      typeof value.directoryPath === "string" &&
      typeof value.fileName === "string"
    )
  } as PostValidator<"/execTargetContext">,
  handler: function (args) {
    return new Promise((resolve) => {
      this.processPool
        .addNewProcessFromDirectoryAndFileName(
          args.directoryPath,
          args.fileName
        )
        .then((result) => {
          if (!evaluateIfFailure(result)) {
            resolve({
              err: null,
              value: {
                ...args,
                uid: result.value,
              },
            })
          } else {
            resolve({ err: result.err, value: null })
          }
        })
        .catch((err) => {
          console.log(err)
          resolve({
            err: {
              message: "Runtime error :<",
              statusCode: 500,
            },
            value: null,
          })
        })
    })
  } as PostHandler<"/execTargetContext">,
} as const
