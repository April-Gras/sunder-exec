<template>
  <div>
    <div v-for="process in processes" :key="process.pid">{{ process }}</div>
  </div>
</template>

<script lang="ts">
import VueMixins from "vue-typed-mixins"

import ButtonMain from "~/components/ui/buttons/main.vue"

import clientIoMixin from "~/mixins/clientIo"

export default VueMixins(clientIoMixin).extend({
  components: {
    ButtonMain,
  },
  async asyncData({ $getApi }) {
    return {
      processes: await $getApi("/currentProcesses"),
    }
  },
})
</script>

<style lang="scss" scoped></style>
