import consola from "consola"
import Vue from "vue"
import { Plugin, Context } from "@nuxt/types"
import {
  AvailablePostRoutes,
  PostReturnPayloadDescriptor,
  PostPayloadDescriptor,
  GetPayloadReturnDescriptor,
  AvailableGetRoutes,
} from "~/modules/sunder-exec/routes/index"
import { ApiGet } from "~/types/getApi"
import { ApiPost } from "~/types/postApi"

function getBaseURL() {
  if (process.client) {
    return `${window.location.protocol}//${window.location.hostname}:3001`
  } else {
    return `http://${process.env.HOST ?? "localhost"}:3001`
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
  $axios.onRequest((config) => {
    consola.info(`${config.method} on ${config.baseURL}${config.url}`)
  })
  $axios.onResponse((response) => {
    consola.success(
      `${response.status} for ${response.config.baseURL}${response.config.url}`
    )
  })
  $axios.onError((err) => {
    consola.error(err)
  })
  $axios.onRequestError((err) => {
    consola.info(`${err.code} on ${err.config.url}`)
    console.error(err)
  })

  const builtApiPost = apiPost.bind({ $axios })
  const builtApiGet = apiGet.bind({ $axios })

  // @ts-ignore for the love of all that is holly, I can't figure this one out :(
  context.$postApi = builtApiPost
  inject("$postApi", builtApiPost)

  // @ts-ignore same issue as for the post api
  context.$getApi = builtApiGet
  inject("$getApi", builtApiGet)

  Vue.prototype.$getApi = builtApiGet
  Vue.prototype.$postApi = builtApiPost
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
