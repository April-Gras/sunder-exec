import { RuntimeConfiguration } from "../configReader"
import { ReqResBundle, SocketManager } from "./index"

type PostPayloadDescriptor = {
  "/readTargetDirectory": {
    directoryPath: string
    fileName: string
  }
}
type AvailablePostRoutes = keyof PostPayloadDescriptor
type PostReturnPayloadDescriptor = {
  "/readTargetDirectory": {
    fileNames: string[]
  }
}

type PostThis = {
  server: ReqResBundle
  ioManager: SocketManager
  runtimeConfig: RuntimeConfiguration
}
export type PostValidator<T extends AvailablePostRoutes> = (
  this: { runtimeConfig: RuntimeConfiguration },
  value: any
) => value is PostPayloadDescriptor[T]
export type PostHandler<T extends AvailablePostRoutes> = (
  this: PostThis,
  value: PostPayloadDescriptor[T]
) => PostReturnPayloadDescriptor[T]

function createPostRoute<T extends AvailablePostRoutes>(
  routeUrl: T,
  handler: PostHandler<T>,
  validator: PostValidator<T>
): {
  handler: PostHandler<T>
  validator: PostValidator<T>
  routeUrl: T
} {
  return {
    handler,
    validator,
    routeUrl,
  }
}

const postRoutes = []
const livePostRoutes = postRoutes.map((e) => e.routeUrl)
