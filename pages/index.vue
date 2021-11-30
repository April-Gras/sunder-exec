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

import { TargetsApiResponse } from "~/helpers/server/fileApi"

import TypoTitle from "~/components/typographic/title.vue"
import FileReading from "~/components/fileReading/index.vue"

export default Vue.extend({
  components: {
    FileReading,
    TypoTitle,
  },
  async asyncData({ $axios }) {
    try {
      return { fileConfigs: await $axios.$get("/read-from-config") }
    } catch (err) {
      console.log({ err })
      return { fileConfigs: [] }
    }
  },
  data() {
    const out = {}

    return out as typeof out & TargetsApiResponse
  },
})
</script>
