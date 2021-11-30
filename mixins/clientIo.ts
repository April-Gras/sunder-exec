import Vue from "vue"

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
    this.socket = this.$clientIoManager.socket("/")
    this.socket.on("connect", () => {
      console.log(this.socket?.connected)
    })
    this.socket.on("disconnect", () => {
      console.log(this.socket?.connected)
    })
    this.postSocketInit(this.socket)
  },
  beforeDestroy() {
    this.socket?.disconnect()
  },
  methods: {
    postSocketInit(socket: ReturnType<typeof io>) {
      console.log("No handler for post io init :(", socket)
    },
    socketListen<T extends AvailableSocketEventsToClient>(
      eventName: T,
      handler: (payload: SocketToClientEventPayloads[T]) => any
    ) {
      if (this.socket !== null) {
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
