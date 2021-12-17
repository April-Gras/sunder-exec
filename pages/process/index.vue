<template>
  <div>
    <TypoTitle>Process listing</TypoTitle>
    <div class="tw-mb-4 tw-flex tw-justify-start tw-items-center">
      <ButtonMain @click.native="terminateSelcetion">Terminate Selection</ButtonMain>
    </div>
    <div class="tw-grid tw-grid-gap-4 tw-grid-cols-1 tw-gap-4">
      <div v-for="process in PROCESSES" :key="process.pid" :process="process" class="rowHolder">
        <VCheckbox v-model="selectedProcesses" :target="process.uid" />
        <ProcessElement :process="process"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"

import TypoTitle from "~/components/typographic/title.vue"
import ProcessElement from "~/components/process/elementDisplay.vue"
import VCheckbox from "~/components/ui/VCheckbox.vue"
import ButtonMain from "~/components/ui/buttons/main.vue"

import { RootState } from "~/store"
import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

export default Vue.extend({
  components: {
    ButtonMain,
    ProcessElement,
    TypoTitle,
    VCheckbox,
  },
  data() {
    return {
      selectedProcesses: [] as ClientSideProcessDefinition["uid"][],
      loading: false,
    }
  },
  computed: {
    ...mapState({
      PROCESSES: (state) => (<RootState>state).processes,
    })
  },
  methods: {
    terminateSelcetion(): void {
      if (!this.loading)
      {
        this.loading = true
        Promise.allSettled(this.selectedProcesses.map(uid => this.$postApi("/terminateProcessByUid", {
          uid
        }))).finally(() => {
          this.loading = false
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.rowHolder {
  @apply tw-grid tw-gap-4 tw-items-center;

  grid-template-columns: 50px 1fr;
}
</style>
