<template>
  <span class="tw-text-sm">{{ deltaTimestamp }} ago</span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

type AvailableStringOutput =
  | `${number} days`
  | `${number} hours`
  | `${number} minutes`
  | `${number} seconds`

export default Vue.extend({
  props: {
    timestamp: {
      type: Number,
      required: true,
    } as PropOptions<ClientSideProcessDefinition["timestamp"]>,
  },
  data() {
    return {
      intervalHolder: null as null | number,
      deltaTimestamp: "N/A" as "N/A" | AvailableStringOutput,
    }
  },
  created(): void {
    this.deltaTimestamp = this.computeElapsedTime()
  },
  mounted(): void {
    this.intervalHolder = window.setInterval(() => {
      this.deltaTimestamp = this.computeElapsedTime()
    }, 1000)
  },
  methods: {
    computeElapsedTime(): AvailableStringOutput {
      const currentTimeStamp = Date.now() / 1000
      const delta = currentTimeStamp - this.timestamp / 1000
      const s = delta
      const m = s / 60
      const h = m / 60
      const d = h / 24

      if (d >= 1) return `${Math.floor(d)} days` as const
      if (h >= 1) return `${Math.floor(h)} hours` as const
      if (m >= 1) return `${Math.floor(m)} minutes` as const
      else return `${Math.floor(s)} seconds` as const
    },
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
