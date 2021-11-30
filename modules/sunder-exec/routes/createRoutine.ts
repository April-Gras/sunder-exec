import getRouteDefinitionArray from "../api/get/index"
import postRouteDefinitionArray from "../api/post/index"
import {
  AvailablePostRoutes,
  PostHandler,
  PostValidator,
  AvailableGetRoutes,
  GetHandler,
} from "./index"

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

export const postRoutes = postRouteDefinitionArray.map((e) =>
  createPostRoute(e.routeUrl, e.handler, e.validator)
)
export const availablePostRouteNames = postRoutes.map((e) => e.routeUrl)

function createGetRoute<T extends AvailableGetRoutes>(
  routeUrl: T,
  handler: GetHandler<T>
): {
  handler: GetHandler<T>
  routeUrl: T
} {
  return {
    routeUrl,
    handler,
  }
}

export const getRoutes = getRouteDefinitionArray.map((e) =>
  createGetRoute(e.routeUrl, e.handler)
)
export const getRouteNames = getRoutes.map((e) => e.routeUrl)
