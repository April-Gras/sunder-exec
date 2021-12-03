import Vue from "vue"
import { Manager } from "socket.io-client"

const manager = new Manager({
  port: 3002,
})

Vue.prototype.$clientIoManager = manager

declare module "vue/types/vue" {
  interface Vue {
    $clientIoManager: Manager
  }
}
