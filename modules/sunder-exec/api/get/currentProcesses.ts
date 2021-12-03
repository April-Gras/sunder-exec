import { GetHandler } from "../../routes/index"

export default {
  routeUrl: "/currentProcesses" as const,
  handler: function () {
    return new Promise((resolve) => {
      resolve({
        err: null,
        value: this.processPool.pool.map((def) => def.getInfos()),
      })
    })
  } as GetHandler<"/currentProcesses">,
}
