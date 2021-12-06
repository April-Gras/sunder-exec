import { PostHandler, PostValidator } from "../../routes/index"

export default {
  routeUrl: "/processByUid",
  validator: function (value) {
    return typeof value === "object" && typeof value.uid === "string"
  } as PostValidator<"/processByUid">,
  handler: function ({ uid }) {
    return new Promise((resolve) => {
      const process = this.processPool.findProcessByUid(uid)

      if (process) resolve({ err: null, value: process.getInfos() })
      else
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
