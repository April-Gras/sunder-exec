<template>
  <div>
    <TypoTitle>Dashboard</TypoTitle>
    <div
      class="tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-2 lg:tw-grid-gap-6"
    >
      <FileReading
        v-for="config in fileConfigs"
        :key="config.directoryPath"
        :config="config"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import consola from "consola"

import { GetPayloadReturnDescriptor } from "module-routes"
import TypoTitle from "~/components/typographic/title.vue"
import FileReading from "~/components/fileReading/index.vue"

type _AsyncData = {
  fileConfigs: GetPayloadReturnDescriptor
}

export default Vue.extend({
  components: {
    FileReading,
    TypoTitle,
  },
  async asyncData({ $getApi }) {
    try {
      const fileConfigs = await $getApi("/readDirectoryFromConfig")

      return {
        fileConfigs,
      }
    } catch (err) {
      consola.error(err)
      return { fileConfigs: [] }
    }
  },
  data() {
    const out = {}

    return out as typeof out & _AsyncData
  },
})
</script>
