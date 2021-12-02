import { IncomingMessage, ServerResponse } from "http"
import { ProcessPool } from "../processPool"
import { SocketIoManager } from "../socket"
import {
  postRoutes,
  availablePostRouteNames,
  getRoutes,
  getRouteNames,
} from "../routes/createRoutine"
import { AvailableGetRoutes, AvailablePostRoutes } from "../routes"
import { RuntimeConfiguration } from "../configReader"
import { getJsonFromReq } from "./getJsonFromReq"

import { resError } from "./resError"

export type ReqResBundle = {
  req: IncomingMessage
  res: ServerResponse
}

export default function (
  req: IncomingMessage,
  res: ServerResponse,
  ioManager: SocketIoManager,
  processPool: ProcessPool,
  runtimeConfig: RuntimeConfiguration
): void {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Request-Method", "*")
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
  res.setHeader("Access-Control-Allow-Headers", "*")
  if (req.method === "OPTIONS") {
    res.statusCode = 200
    res.end()
  } else {
    res.setHeader("Content-Type", "application/json")

    switch (req.method) {
      case "GET":
        handleGetRequest({
          req,
          res,
          ioManager,
          processPool,
          runtimeConfig,
        })
        break
      case "POST":
        handlePostRequest({
          req,
          res,
          ioManager,
          processPool,
          runtimeConfig,
        })
        break
      default:
        res.statusCode = 404
        res.statusMessage = "Url not found"
        res.end("Url not found")
    }
  }
}

type HandleRequestContext = {
  req: IncomingMessage
  res: ServerResponse
  ioManager: SocketIoManager
  processPool: ProcessPool
  runtimeConfig: RuntimeConfiguration
}

function handlePostRequest({
  req,
  res,
  ioManager,
  processPool,
  runtimeConfig,
}: HandleRequestContext): void {
  const { url } = req

  if (isPartOfPostSet(url)) {
    const { validator, handler } = postRoutes[url]

    getJsonFromReq(req).then((body) => {
      if (validator.bind({ runtimeConfig })(body)) {
        handler
          .bind({
            server: {
              req,
              res,
            },
            ioManager,
            runtimeConfig,
            processPool,
            // @ts-ignore
          })(body)
          // @ts-ignore
          .then(({ err, value }) => {
            if (value) res.end(JSON.stringify(value))
            else if (err) resError(res, err.message, err.statusCode)
          })
      } else resError(res, "Runtime issue :<", 500)
    })
  } else resError(res, "Url not found", 404)
}

function handleGetRequest({
  req,
  res,
  ioManager,
  processPool,
  runtimeConfig,
}: HandleRequestContext): void {
  const { url } = req

  console.log({ url })
  if (isPartOfUrlSet(getRouteNames, url)) {
    const { handler } = getRoutes.find((e) => e.routeUrl) ?? {}

    if (handler) {
      handler
        .bind({
          server: {
            req,
            res,
          },
          ioManager,
          runtimeConfig,
          processPool,
        })()
        .then(({ err, value }) => {
          if (value) res.end(JSON.stringify(value))
          else if (err) resError(res, err.message, err.statusCode)
          else resError(res, "Runtime issue :<", 500)
        })
    } else resError(res, "Run time issue", 404)
  } else resError(res, "Url not found", 404)
}

function isPartOfPostSet(url: any & string): url is AvailablePostRoutes {
  return availablePostRouteNames.includes(url)
}

function isPartOfUrlSet<T extends AvailablePostRoutes | AvailableGetRoutes>(
  urlSet: string[],
  url?: string
): boolean {
  return urlSet.includes(url ?? "")
}
