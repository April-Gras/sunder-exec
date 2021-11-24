import http, { Server } from 'http'
import { Module } from '@nuxt/types'
import express from 'express'
import { getRuntimeExtention } from './configReader'
import { ProcessPool } from './processPool'
import { initializeSocketProcess } from './socket'

export const IO_PORT = 3001

const sunderExecModule: Module = async function () {
  const runtimeConfiguration = await getRuntimeExtention()
  const processes = new ProcessPool(runtimeConfiguration)

  this.nuxt.hook('listen', () => {
    const app = express()
    const server = http.createServer()

    this.nuxt.options.cli.badgeMessages.push(`IO Module on ${this.nuxt.options.server.host}:${IO_PORT}`)
    server.listen(IO_PORT, () => {
      const ioManager = initializeSocketProcess(server)
    })
  })
}

export default sunderExecModule
