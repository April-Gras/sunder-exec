import {
  AvailablePostRoutes,
  PostReturnPayloadDescriptor,
  PostPayloadDescriptor,
} from "module-routes"

export type ApiPost = <T extends AvailablePostRoutes>(
  url: T,
  payload: PostPayloadDescriptor[T]
) => Promise<PostReturnPayloadDescriptor[T]>
