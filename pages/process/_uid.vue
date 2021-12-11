<template>
  <div>
    <ProcessElement :process="inspectedProcess.process" />
    <Terminal :inspected-process="inspectedProcess" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import ProcessElement from "~/components/process/elementDisplay.vue"
import Terminal from "~/components/terminal/index.vue"

import { PostReturnPayloadDescriptor } from "module-routes"

type _AsyncData = {
  inspectedProcess: PostReturnPayloadDescriptor["/processByUid"]
}

export default Vue.extend({
  components: {
    Terminal,
    ProcessElement,
  },
  async asyncData({ $postApi, error, params }) {
    try {
      return {
        inspectedProcess: await $postApi("/processByUid", {
          uid: params.uid,
        }),
      }
    } catch (err) {
      error({
        message: "Process not found",
        statusCode: 404,
      })
    }
  },
  data() {
    const out = {}

    return out as typeof out & _AsyncData
  },
})
</script>

<style lang="scss" scoped></style>
