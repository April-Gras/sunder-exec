import { Server } from 'http'
import fs from 'fs'
import { exec, ChildProcess } from 'child_process'
import UIDGenerator from 'uid-generator'
import { Module } from '@nuxt/types'
import { Server as SocketIoServer, Socket } from 'socket.io'
import runtimeConfiguration from '../runtimeConfiguration'
import { extractExtentionFromFileName } from '../helpers/server/fileApi'

const uidgen = new UIDGenerator()
const childProcessPool = {} as Record<string, {
  process: ChildProcess | null
  fileName: string
  execString: string
  directoryPath: string
}>

const socketIoModule: Module<{}> = function () {
  this.nuxt.hook('listen', (server: Server, { port }: { port: number }) => {
    const io = new SocketIoServer(server)

    console.log(`[SOCKET IO] - Listening on port ${port}`)
    io.on('connection', (socket) => {
      for (const key in socketServerListenConfig) {
        const typeKey = key as keyof typeof socketServerListenConfig

        socket.on(key, socketServerListenConfig[typeKey].bind({ socket, io }))
      }
    })
  })
}

export type SocketToServerEventPayloads = {
  launchScript: {
    directoryPath: string,
    fileName: string
  }
  typeTest: string
}
export type AvailableSocketEventsToServer = keyof SocketToServerEventPayloads

type BindedThis = { socket: Socket, io: SocketIoServer }
type ListenFunction = (this: BindedThis, value: SocketToServerEventPayloads[AvailableSocketEventsToServer]) => void
const socketServerListenConfig = {
  launchScript (value: SocketToServerEventPayloads['launchScript']) {
    const { directoryPath, fileName } = value
    const fullTargetPath = `${directoryPath}${directoryPath.endsWith('/') ? '' : '/'}${fileName}`

    if (fs.existsSync(fullTargetPath)) {
      const uid = uidgen.generateSync()
      const extention = extractExtentionFromFileName(fileName)
      const launchCmd = extention ? runtimeConfiguration.extentionMapping[extention] : null

      if (extention === null || launchCmd !== null) {
        const execString = `${launchCmd ? `${launchCmd} ` : ''} ${fullTargetPath}`
        const process = exec(execString)

        childProcessPool[uid] = {
          process,
          execString,
          fileName,
          directoryPath
        }

        serverSideEmit(this.socket, 'confirmScriptLaunch', { directoryPath, fileName, uid })
        // TODO setup stdout and stderr reads
        process.stdout?.setEncoding('utf-8')
        process.stderr?.setEncoding('utf-8')
        process.stdout?.on('data', (string: string) => {
          serverSideBroadcast(this.io, 'streamData', {
            directoryPath,
            fileName,
            uid,
            type: 'out',
            text: string
          })
        })
        process.stderr?.on('data', (string: string) => {
          serverSideBroadcast(this.io, 'streamData', {
            directoryPath,
            fileName,
            uid,
            type: 'err',
            text: string
          })
        })
      } else {
        // TODO handle missing extention mapping
        console.log('MISSING EXTENTION MAPPING')
      }
    } else {
      // TODO handle failure
      console.log("FILE DOESN'T EXIST :(")
    }
  }
} as Record<AvailableSocketEventsToServer, ListenFunction>

export type SocketToClientEventPayloads = {
  confirmScriptLaunch: {
    directoryPath: string,
    fileName: string,
    uid: string
  }
  streamData: {
    directoryPath: string
    fileName: string
    uid: string
    type: 'err' | 'out'
    text: string
  }
}
export type AvailableSocketEventsToClient = keyof SocketToClientEventPayloads

function serverSideBroadcast<T extends AvailableSocketEventsToClient> (io: SocketIoServer, eventName: T, payload:SocketToClientEventPayloads[T]) {
  io.emit(eventName, payload)
}

function serverSideEmit<T extends AvailableSocketEventsToClient> (socket: Socket, eventName: T, payload: SocketToClientEventPayloads[T]) : void {
  socket.emit(eventName, payload)
}

export default socketIoModule
