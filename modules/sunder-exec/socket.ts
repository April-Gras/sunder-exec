import { Server as SocketIoServer } from "socket.io"
import { ProcessInfos } from "./processPool"

export type SocketToClientEventPayloads = {
  confirmScriptLaunch: ProcessInfos
  streamData: {
    directoryPath: string
    fileName: string
    uid: string
    type: "err" | "out"
    text: string
  }
  confirmScriptExit: {
    code: number | -1
    signal: NodeJS.Signals | "N/A"
    process: ProcessInfos
  }
}
export type AvailableSocketEventsToClient = keyof SocketToClientEventPayloads

class SocketManager {
  private io: SocketIoServer

  constructor() {
    this.io = new SocketIoServer(3002, {
      cors: {
        origin: /.*/,
        methods: ["GET", "POST"],
      },
    })
  }

  emit<T extends AvailableSocketEventsToClient>(
    eventName: T,
    payload: SocketToClientEventPayloads[T]
  ): void {
    this.io.emit(eventName, payload)
  }
}

export function initializeSocketProcess(): SocketManager {
  return new SocketManager()
}

export type SocketIoManager = ReturnType<typeof initializeSocketProcess>
