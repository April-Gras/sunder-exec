<template>
  <div class="tw-p-4 tw-bg-gray-600">
    <div
      class="sendSignal tw-space-y-4 600:tw-space-y-0 600:tw-space-x-4"
      :class="{ canSendSignal }"
    >
      <VSelect
        v-model="value"
        reverse-dropdown-position
        :available-options="availableNodeJsSignal"
      />
      <ButtonMain class="tw-flex-shrink-0" @click.native="sendSignal"
        >Send signal !</ButtonMain
      >
      <ButtonMain class="tw-flex-shrink-0" @click.native="terminateProcess"
        >Terminate process</ButtonMain
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

import ButtonMain from "~/components/ui/buttons/main.vue"
import VSelect from "~/components/ui/VSelect.vue"

import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"
import { availableNodeJsSignal } from "~/static/signals"

export default Vue.extend({
  components: {
    ButtonMain,
    VSelect,
  },
  props: {
    process: {
      type: Object,
      required: true,
    } as PropOptions<ClientSideProcessDefinition>,
  },
  data() {
    return {
      loading: false,
      value: availableNodeJsSignal[0],
      availableNodeJsSignal: availableNodeJsSignal as readonly NodeJS.Signals[],
    }
  },
  computed: {
    processIsAlive(): boolean {
      return !this.process.exited
    },
    canSendSignal(): boolean {
      return this.processIsAlive && !this.loading
    },
  },
  methods: {
    sendSignal() {
      if (this.canSendSignal) {
        this.loading = true
        this.$postApi("/sendSignalToProcessWithUid", {
          uid: this.process.uid,
          signal: this.value,
        }).finally(() => {
          this.loading = false
        })
      }
    },
    terminateProcess() {
      if (this.canSendSignal) {
        this.loading = true
        this.$postApi("/terminateProcessByUid", {
          uid: this.process.uid,
        }).finally(() => {
          this.loading = false
        })
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.sendSignal {
  @apply tw-flex tw-justify-between tw-items-center tw-flex-wrap;
  @apply tw-transition-opacity tw-duration-150 tw-ease-in-out;

  &:not(.canSendSignal) {
    @apply tw-opacity-25 tw-pointer-events-none;
  }

  @screen 600 {
    @apply tw-flex-nowrap;
  }
}
</style>
