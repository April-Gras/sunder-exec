import {
  AvailablePostRoutes,
  PostReturnPayloadDescriptor,
  PostPayloadDescriptor,
} from "~/modules/sunder-exec/routes/index"

export type ApiPost = <T extends AvailablePostRoutes>(
  url: T,
  payload: PostPayloadDescriptor[T]
) => Promise<PostReturnPayloadDescriptor[T]>
