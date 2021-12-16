import readTargetDirectory from "../api/post/readTargetDirectory"
import execTargetContext from "../api/post/execTargetContext"
import sendSignalToProcessWithUid from "../api/post/sendSignalToProcessWithUid"
import terminateProcessByUid from "../api/post/terminateProcessByUid"
import readDirectoryFromConfig from "../api/get/readDirectoryFromConfig"
import processByUid from "../api/post/processByUid"
import currentProcesses from "../api/get/currentProcesses"

export const postRoutes = {
  [terminateProcessByUid.routeUrl]: terminateProcessByUid,
  [readTargetDirectory.routeUrl]: readTargetDirectory,
  [execTargetContext.routeUrl]: execTargetContext,
  [processByUid.routeUrl]: processByUid,
  [sendSignalToProcessWithUid.routeUrl]: sendSignalToProcessWithUid,
} as const
export const availablePostRouteNames = Object.values(postRoutes).map(
  (e) => e.routeUrl
)

export const getRoutes = [readDirectoryFromConfig, currentProcesses] as const
export const getRouteNames = getRoutes.map((e) => e.routeUrl)
