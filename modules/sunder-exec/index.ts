import http from 'http'
import { Module } from '@nuxt/types'
import { getRuntimeExtention } from './configReader'
import { ProcessPool } from './processPool'
import { initializeSocketProcess } from './socket'

const IO_PORT = 3001

const sunderExecModule: Module = async function () {
  const runtimeConfiguration = await getRuntimeExtention()
  const processes = new ProcessPool(runtimeConfiguration)

  this.nuxt.hook('listen', () => {
    const ioManager = initializeSocketProcess()
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Request-Method', '*')
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
      res.setHeader('Access-Control-Allow-Headers', '*')
      res.setHeader('Content-Type', 'application/json')

      // TODO Organise this mess
      if (req.url === '/rest-ping' && req.method === 'GET') {
        ioManager.emit('confirmScriptLaunch', { directoryPath: 'test', fileName: 'test', uid: 'more test' })
        res.end(JSON.stringify('ok'))
      } else { res.end(JSON.stringify('ok')) }
    })

    this.nuxt.options.cli.badgeMessages.push(`REST API on ${this.nuxt.options.server.host}:${IO_PORT}`)
    this.nuxt.options.cli.badgeMessages.push(`SOCKET IO on ${this.nuxt.options.server.host}:${3002}`)
    server.listen(IO_PORT)
  })
}

export default sunderExecModule
