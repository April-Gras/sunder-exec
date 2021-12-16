<template>
  <transition>
    <div v-if="process.killed" class="processElementStatus killed">
      Killed / {{ statusContext }}
    </div>
    <div v-else-if="process.exited" class="processElementStatus exited">
      Exit / {{ statusContext }}
    </div>
    <div v-else class="processElementStatus alive">Running</div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

export default Vue.extend({
  props: {
    process: {
      type: Object,
      required: true,
    } as PropOptions<ClientSideProcessDefinition>,
  },
  computed: {
    statusContext(): number | NodeJS.Signals | null {
      return this.process.signalCode ?? this.process.exitCode
    },
  },
})
</script>
<style lang="scss" scoped>
.processElementStatus {
  @apply tw-transition-colors tw-duration-150 tw-ease-in-out tw-text-black tw-text-sm tw-py-1 tw-px-4 tw-ml-auto tw-rounded;

  width: fit-content;

  &.killed {
    @apply tw-bg-error;
  }

  &.exited {
    @apply tw-bg-red-100;
  }

  &.alive {
    @apply tw-bg-green-100;
  }
}
</style>
