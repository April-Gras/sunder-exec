<template>
  <NuxtLink
    :to="link"
    class="
      tw-rounded-lg
      tw-bg-gray-600
      tw-p-4
      tw-transition
      tw-duration-150
      tw-ease-in-out
      hover:tw-bg-gray-700
      tw-cursor-pointer
    "
  >
    <TypoSubtitle>{{ config.directoryPath }}</TypoSubtitle>
    <div class="tw-text-sm">
      {{ config.fileNameArray.length }} potencial scripts
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

import { GetPayloadReturnDescriptor } from "module-routes"
import TypoSubtitle from "~/components/typographic/subtitle.vue"

export default Vue.extend({
  components: {
    TypoSubtitle,
  },
  props: {
    config: {
      type: Object,
      required: true,
    } as PropOptions<
      GetPayloadReturnDescriptor["/readDirectoryFromConfig"][number]
    >,
  },
  computed: {
    link(): string {
      if (this.config.directoryPath.startsWith("/")) {
        return encodeURI(`/directory${this.config.directoryPath}`)
      } else {
        return encodeURI(`/directory/${this.config.directoryPath}`)
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
