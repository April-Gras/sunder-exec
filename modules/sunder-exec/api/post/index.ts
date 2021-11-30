import {
  postExecTargetContextValidator,
  postExecTargetContextHandler,
} from "./execTargetContext"

export default [
  {
    validator: postExecTargetContextValidator,
    handler: postExecTargetContextHandler,
    routeUrl: "/execTargetContext" as const,
  },
]
