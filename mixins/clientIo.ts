import Vue from "vue"

import consola from "consola"

import { io } from "socket.io-client"

import {
  SocketToClientEventPayloads,
  AvailableSocketEventsToClient,
} from "~/modules/sunder-exec/socket"

export type Socket = ReturnType<typeof io>

export default Vue.extend({
  data() {
    return {
      socket: null as null | ReturnType<typeof io>,
    }
  },
  mounted() {
    if (!this.socket) {
      this.socket = this.$clientIoManager
      this.socket.on("connect", () => {
        if (this.socket?.connected) consola.success("[SOCKET] - Connected")
        else consola.error("[SOCKET] - Failed to connect")
      })
      this.socket.on("disconnect", () => {
        consola.info("[SOCKET] - Disconnected")
      })
      this.postSocketInit(this.socket)
    }
  },
  methods: {
    postSocketInit(_socket: ReturnType<typeof io>) {
      consola.warn("[SOCKET] - No handler for post io init")
    },
    socketListen<T extends AvailableSocketEventsToClient>(
      eventName: T,
      handler: (payload: SocketToClientEventPayloads[T]) => any
    ) {
      if (this.socket !== null) {
        consola.info(`[SOCKET] - Setup listener on ${eventName}`)
        // @ts-ignore trust lmfao
        this.socket.on(eventName, handler)
      } else {
        console.warn(
          `Socket not initialized but a listener on ${eventName} was attempted to be opened`
        )
      }
    },
  },
})
