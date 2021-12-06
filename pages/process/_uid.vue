<template>
  <ProcessElement :process="process" />
</template>

<script lang="ts">
import Vue from "vue"

import ProcessElement from "~/components/process/element.vue"

import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

type _AsyncData = {
  process: ClientSideProcessDefinition
}

export default Vue.extend({
  components: {
    ProcessElement,
  },
  async asyncData({ $postApi, error, params }) {
    try {
      return {
        process: await $postApi("/processByUid", {
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
