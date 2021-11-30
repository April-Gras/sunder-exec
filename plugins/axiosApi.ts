import { Plugin, Context } from "@nuxt/types"
import {
  AvailablePostRoutes,
  PostReturnPayloadDescriptor,
  PostPayloadDescriptor,
  GetPayloadReturnDescriptor,
  AvailableGetRoutes,
} from "~/modules/sunder-exec/routes/index"

import { ApiPost } from "~/types/postApi"
import { ApiGet } from "~/types/getApi"

function getBaseURL() {
  if (process.client) {
    return `${window.location.protocol}//${window.location.hostname}:3001/`
  } else {
    return `${process.env.HOST}:3001/`
  }
}

const apiGet = function <T extends AvailableGetRoutes>(
  this: { $axios: Context["$axios"] },
  url: T
): Promise<GetPayloadReturnDescriptor[T]> {
  return this.$axios.$get(url, {
    baseURL: getBaseURL(),
  })
}

const apiPost = function <T extends AvailablePostRoutes>(
  this: { $axios: Context["$axios"] },
  url: T,
  payload: PostPayloadDescriptor[T]
): Promise<PostReturnPayloadDescriptor[T]> {
  return this.$axios.$post(url, payload, {
    baseURL: getBaseURL(),
  })
}

const axiosApiPlugin: Plugin = function (context, inject) {
  const {
    app: { $axios },
  } = context
  const builtApiPost = apiPost.bind({ $axios })
  const builtApiGet = apiGet.bind({ $axios })

  context.$postApi = builtApiPost
  inject("$postApi", builtApiPost)

  context.$getApi = builtApiGet
  inject("$$getApi", builtApiGet)
}

declare module "vue/types/vue" {
  interface Vue {
    $postApi: ApiPost
    $getApi: ApiGet
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $postApi: ApiPost
    $getApi: ApiGet
  }
  interface Context {
    $postApi: ApiPost
    $getApi: ApiGet
  }
}

export default axiosApiPlugin
