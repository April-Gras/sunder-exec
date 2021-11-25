import Vue from 'vue'

import { io } from 'socket.io-client'
import { SocketToServerEventPayloads, AvailableSocketEventsToServer, SocketToClientEventPayloads, AvailableSocketEventsToClient } from '~/modules/socket-io'

export type Socket = ReturnType<typeof io>

export default Vue.extend({
  data () {
    return {
      socket: null as null | ReturnType<typeof io>
    }
  },
  mounted () {
    this.socket = this.$clientIoManager.socket('/')
    this.socket.on('connect', () => { console.log(this.socket?.connected) })
    this.socket.on('disconnect', () => { console.log(this.socket?.connected) })
    this.postSocketInit(this.socket)
  },
  beforeDestroy () {
    this.socket?.disconnect()
  },
  methods: {
    postSocketInit (socket: ReturnType<typeof io>) {
      console.log('No handler for post io init :(', socket)
    },
    socketEmit<T extends AvailableSocketEventsToServer> (eventName: T, payload: SocketToServerEventPayloads[T]): void {
      if (this.socket !== null) {
        this.socket.emit(eventName, payload)
      } else { console.warn(`Socket not initialized but ${eventName} was called with payload ${payload}`) }
    },
    socketListen<T extends AvailableSocketEventsToClient> (eventName: T, handler: ((payload: SocketToClientEventPayloads[T]) => any)) {
      if (this.socket !== null) {
        // @ts-ignore trust lmfao
        this.socket.on(eventName, handler)
      } else { console.warn(`Socket not initialized but a listener on ${eventName} was attempted to be opened`) }
    }
  }
})
