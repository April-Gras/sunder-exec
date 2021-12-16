<template>
  <div class="tw-bg-darkest tw-relative heightControl tw-overflow-x-auto">
    <div class="tw-sticky tw-top-0"><slot name="header" /></div>
    <div class="tw-whitespace-pre-wrap tw-p-4 md:tw-p-6 lg:tw-p-10">
      <span class="old">{{ inspectedProcess.logs.text }}</span
      ><span
        v-for="(logs, index) in additionalLogs"
        :key="index"
        :class="logs.type"
        >{{ logs.text }}</span
      >
    </div>
    <div class="tw-sticky tw-bottom-0"><slot name="footer" /></div>
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
        if (this.inspectedProcess.process.uid === payload.uid) {
          this.additionalLogs.push(payload)
        }
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.old {
  @apply tw-text-gray-400;
}

.out {
  @apply tw-text-white;
}

.error {
  @apply tw-text-error;
}

.heightControl {
  max-height: calc(100vh - 112px - (theme("spacing.4") * 2));

  @screen sm {
    max-height: calc(100vh - 112px - (theme("spacing.6") * 2));
  }
}
</style>
