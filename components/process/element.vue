<template>
  <NuxtLink class="processElementWrapper" :to="`/process/${process.uid}`">
    <div class="tw-text-sm">
      <span
        class="tw-overflow-ellipsis tw-whitespace-nowrap tw-overflow-hidden tw-hidden sm:tw-block"
        >{{ process.directoryPath }}</span
      >
      <span class="sm:tw-flex-shrink-0">/{{ process.fileName }}</span>
    </div>
    <ElementStatus :killed="process.killed" :exit-code="process.exitCode" />
  </NuxtLink>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

import ElementStatus from "./element/status.vue"

import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

export default Vue.extend({
  components: {
    ElementStatus,
  },
  props: {
    process: {
      type: Object,
      required: true,
    } as PropOptions<ClientSideProcessDefinition>,
  },
})
</script>

<style lang="scss" scoped>
.processElementWrapper {
  @apply tw-grid tw-gap-4 tw-bg-gray-600 tw-text-white tw-grid-cols-1 tw-px-2 tw-py-4 tw-cursor-pointer tw-rounded-sm;
  @apply tw-transition-colors tw-duration-150 tw-ease-in-out;

  &:hover {
    @apply tw-bg-gray-400;
  }

  @screen sm {
    @apply tw-grid-cols-2;

    > * {
      @apply tw-flex tw-justify-center tw-items-center;
    }
  }
}
</style>
