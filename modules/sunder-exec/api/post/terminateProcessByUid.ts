import treeKill from "tree-kill"
import { PostValidator, PostHandler } from "../../routes/index"

export default {
  routeUrl: "/terminateProcessByUid" as const,
  validator: function (value) {
    return typeof value === "object" && typeof value.uid === "string"
  } as PostValidator<"/terminateProcessByUid">,
  handler: function (value) {
    return new Promise((resolve) => {
      const definition = this.processPool.findProcessByUid(value.uid)

      if (definition && definition.process.pid) {
        treeKill(definition.process.pid, (err) => {
          resolve({
            err: null,
            value: {
              succeeded: err === undefined,
            },
          })
        })
      } else
        resolve({
          err: {
            statusCode: 404,
            message: `Could not find process with uid ${value.uid}`,
          },
          value: null,
        })
    })
  } as PostHandler<"/terminateProcessByUid">,
} as const
