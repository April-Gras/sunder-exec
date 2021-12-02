import {
  AvailableGetRoutes,
  GetPayloadReturnDescriptor,
} from "~/modules/sunder-exec/routes/index"

export type ApiGet = <T extends AvailableGetRoutes>(
  url: T
) => Promise<GetPayloadReturnDescriptor[T]>
