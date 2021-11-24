import { Server } from 'http'
import { Server as SocketIoServer } from 'socket.io'

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

class SocketManager {
  private io: SocketIoServer

  constructor (io: SocketIoServer) {
    this.io = io

    io.on('connect', (socket) => {
      // Setup debug events
      socket.on('ping', () => {
        io.emit('pong', 'from io')
        socket.emit('pong', 'from socket')
      })
    })
  }

  emit<T extends AvailableSocketEventsToClient> (eventName: T, payload: SocketToClientEventPayloads[T]): void {
    this.io.emit(eventName, payload)
  }
}

export function initializeSocketProcess (server: Server): SocketManager {
  return new SocketManager(new SocketIoServer(server))
}
