<template>
  <div>
    <ButtonMain @click.native="ping" />
  </div>
</template>

<script lang="ts">
import VueMixins from 'vue-typed-mixins'

import ButtonMain from '~/components/ui/buttons/main.vue'

import clientIoMixin from '~/mixins/clientIo'

export default VueMixins(clientIoMixin).extend({
  components: {
    ButtonMain
  },
  methods: {
    postSocketInit (): void {
      if (this.socket) {
        this.socket.on('pong', (payload) => {
          console.log(payload)
        })
      }
    },
    ping (): void {
      this.socket?.emit('ping')
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
