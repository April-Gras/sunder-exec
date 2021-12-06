<template>
  <transition>
    <div v-if="killed" class="processElementStatus killed">
      Killed / {{ process.exitCode }}
    </div>
    <div v-else class="processElementStatus alive">Running</div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

export default Vue.extend({
  props: {
    killed: {
      type: Boolean,
      required: true,
    } as PropOptions<ClientSideProcessDefinition["killed"]>,
    exitCode: {
      type: Number,
      required: false,
      default: null,
    } as PropOptions<ClientSideProcessDefinition["exitCode"]>,
  },
})
</script>
<style lang="scss" scoped>
.processElementStatus {
  @apply tw-transition-colors tw-duration-150 tw-ease-in-out tw-text-black tw-text-sm tw-py-1 tw-px-4 tw-ml-auto tw-rounded;

  width: fit-content;

  &.killed {
    @apply tw-bg-red-100;
  }

  &.alive {
    @apply tw-bg-green-100;
  }
}
</style>
