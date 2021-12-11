<template>
  <div class="tw-rounded-lg tw-mt-12 tw-whitespace-pre-wrap">
    <span class="old">{{ inspectedProcess.logs.text }}</span>
    <span
      v-for="(logs, index) in additionalLogs"
      :key="index"
      :class="logs.type"
      >{{ logs.text }}</span
    >
  </div>
</template>

<script lang="ts">
import { PropOptions } from "vue"
import VueMixins from "vue-typed-mixins"

import clientIoMixin from "~/mixins/clientIo"

import { PostReturnPayloadDescriptor } from "module-routes"

export default VueMixins(clientIoMixin).extend({
  props: {
    inspectedProcess: {
      type: Object,
      required: true,
    } as PropOptions<PostReturnPayloadDescriptor["/processByUid"]>,
  },
  data() {
    return {
      additionalLogs:
        [] as PostReturnPayloadDescriptor["/processByUid"]["logs"][],
    }
  },
  methods: {
    postSocketInit() {
      this.socketListen("streamData", (payload) => {
        if (this.inspectedProcess.process.uid === payload.uid)
          this.additionalLogs.push(payload)
      })
    },
  },
  watch: {},
})
</script>

<style lang="scss" scoped></style>
