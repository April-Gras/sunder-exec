<template>
  <NuxtLink
    class="processElementWrapper"
    :class="{ selected, hasCheckbox }"
    :to="`/process/${process.uid}`"
  >
    <div class="tw-text-sm">
      <span
        class="tw-overflow-ellipsis tw-whitespace-nowrap tw-overflow-hidden tw-hidden sm:tw-block"
        >{{ process.directoryPath }}</span
      >
      <span class="sm:tw-flex-shrink-0">/{{ process.fileName }}</span>
    </div>
    <div>
      <ElementTimeTracker :timestamp="process.timestamp" />
    </div>
    <ElementStatus :process="process" />
  </NuxtLink>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

import ElementStatus from "./elementDisplay/processStatus.vue"
import ElementTimeTracker from "./elementDisplay/timeTracker.vue"

import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

export default Vue.extend({
  components: {
    ElementStatus,
    ElementTimeTracker,
  },
  props: {
    selected: {
      type: Boolean,
      default: false,
      required: false,
    },
    hasCheckbox: {
      type: Boolean,
      required: false,
      default: false,
    },
    process: {
      type: Object,
      required: true,
    } as PropOptions<ClientSideProcessDefinition>,
  },
})
</script>

<style lang="scss" scoped>
.processElementWrapper {
  @apply tw-grid tw-gap-4 tw-bg-gray-600 tw-text-white tw-grid-cols-1 tw-p-4 tw-cursor-pointer tw-rounded-sm tw-shadow;
  @apply tw-transition tw-duration-150 tw-ease-in-out;

  &:hover {
    @apply tw-bg-gray-400 tw-shadow-hover;
  }

  @screen 600 {
    @apply tw-grid-cols-3;

    > * {
      @apply tw-flex tw-justify-center tw-items-center;
    }
  }
}
</style>
