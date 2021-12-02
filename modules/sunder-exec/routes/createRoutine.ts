import readTargetDirectory from "../api/post/readTargetDirectory"
import execTargetContext from "../api/post/execTargetContext"
import readDirectoryFromConfig from "../api/get/readDirectoryFromConfig"

export const postRoutes = {
  [readTargetDirectory.routeUrl]: readTargetDirectory,
  [execTargetContext.routeUrl]: execTargetContext,
} as const
export const availablePostRouteNames = Object.values(postRoutes).map(
  (e) => e.routeUrl
)

export const getRoutes = [readDirectoryFromConfig] as const
export const getRouteNames = getRoutes.map((e) => e.routeUrl)
