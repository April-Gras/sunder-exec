import http from "http"
import { Module } from "@nuxt/types"
import { getRuntimeExtention } from "./configReader"
import { ProcessPool } from "./processPool"
import { initializeSocketProcess } from "./socket"

import api from "./api"

const IO_PORT = 3001

const sunderExecModule: Module = async function () {
  const runtimeConfiguration = await getRuntimeExtention()

  this.nuxt.hook("listen", () => {
    const ioManager = initializeSocketProcess()
    const processes = new ProcessPool(runtimeConfiguration, ioManager)
    const server = http.createServer((req, res) => {
      api(req, res, ioManager, processes, runtimeConfiguration)
    })

    this.nuxt.options.cli.badgeMessages.push(
      `REST API on ${this.nuxt.options.server.host}:${IO_PORT}`
    )
    this.nuxt.options.cli.badgeMessages.push(
      `SOCKET IO on ${this.nuxt.options.server.host}:${3002}`
    )
    server.listen(IO_PORT)
  })
}

export default sunderExecModule
