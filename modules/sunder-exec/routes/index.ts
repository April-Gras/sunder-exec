import { RuntimeConfiguration } from "../configReader"
import { ProcessPool } from "../processPool"
import { SocketIoManager } from "../socket"
import { ReqResBundle } from "../api/index"

type Context = {
  server: ReqResBundle
  ioManager: SocketIoManager
  runtimeConfig: RuntimeConfiguration
  processPool: ProcessPool
}

export type ErrorDefinition = {
  message: string
  statusCode: number
}
export type ApiResult<T> =
  | {
      err: ErrorDefinition
      value: null
    }
  | {
      err: null
      value: T
    }

export type GetPayloadReturnDescriptor = {
  "/readDirectoryFromConfig": {
    fileNameArray: string[]
    directoryPath: string
  }[]
}
export type AvailableGetRoutes = keyof GetPayloadReturnDescriptor
export type GetHandler<T extends AvailableGetRoutes> = (
  this: Context
) => Promise<ApiResult<GetPayloadReturnDescriptor[T]>>

export type PostPayloadDescriptor = {
  "/execTargetContext": {
    directoryPath: string
    fileName: string
  }
  "/readTargetDirectory": {
    targetDirectory: string
  }
}
export type AvailablePostRoutes = keyof PostPayloadDescriptor
export type PostReturnPayloadDescriptor = {
  "/execTargetContext": {
    uid: string
    directoryPath: string
    fileName: string
  }
  "/readTargetDirectory": {
    fileNameArray: string[]
    directoryPath: string
  }
}
export type PostValidator<T extends AvailablePostRoutes> = (
  this: { runtimeConfig: RuntimeConfiguration },
  value: any
) => value is PostPayloadDescriptor[T]

export function evaluateIfFailure<T>(
  result: ApiResult<T>
): result is { err: ErrorDefinition; value: null } {
  return result.err !== null
}

export type PostHandler<T extends AvailablePostRoutes> = (
  this: Context,
  args: PostPayloadDescriptor[T]
) => Promise<ApiResult<PostReturnPayloadDescriptor[T]>>
