import treeKill from "tree-kill"
import { PostValidator, PostHandler } from "../../routes/index"
import { availableNodeJsSignal } from "../../../../static/signals"

export default {
  routeUrl: "/sendSignalToProcessWithUid" as const,
  validator: function (value) {
    return (
      typeof value === "object" &&
      typeof value.signal === "string" &&
      typeof value.uid === "string" &&
      availableNodeJsSignal.includes(value.signal)
    )
  } as PostValidator<"/sendSignalToProcessWithUid">,
  handler: function (value) {
    return new Promise((resolve) => {
      const definition = this.processPool.findProcessByUid(value.uid)

      if (definition && definition.isAlive && definition.process.pid) {
        treeKill(definition.process.pid, value.signal, (err) => {
          resolve({
            value: {
              succeeded: err === undefined,
            },
            err: null,
          })
        })
      } else {
        resolve({
          err: {
            message: `Process with uid ${value.uid} not found`,
            statusCode: 404,
          },
          value: null,
        })
      }
    })
  } as PostHandler<"/sendSignalToProcessWithUid">,
} as const
