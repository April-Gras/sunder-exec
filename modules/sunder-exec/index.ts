import fs from "fs"
import http from "http"
import consola from "consola"
import { Module } from "@nuxt/types"
import { getRuntimeExtention } from "./configReader"
import { ProcessPool } from "./processPool"
import { initializeSocketProcess } from "./socket"

import api from "./api"

const IO_PORT = 3001

const sunderExecModule: Module = async function () {
  const runtimeConfiguration = await getRuntimeExtention()

  this.nuxt.hook("listen", () => {
    consola.info("[MODULE] - Checking for log folder")
    if (!fs.existsSync(runtimeConfiguration.logDirectory)) {
      consola.info("[MODULE] - Creating log folder")
      fs.mkdirSync(runtimeConfiguration.logDirectory, 0o744)
    }
    if (!fs.statSync(runtimeConfiguration.logDirectory).isDirectory())
      consola.error(
        "[MODULE] - log directory targetpath already exists and it's not a directory"
      )
    else consola.success("[MODULE] - Log directory found")
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
