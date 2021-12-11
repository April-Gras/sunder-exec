<template>
  <div>
    <TypoTitle>Job listing</TypoTitle>
    <div class="tw-grid tw-grid-gap-4 tw-grid-cols-1 tw-gap-4">
      <ProcessElement v-for="process in PROCESSES" :key="process.pid" :process="process" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"

// TODO set up recycle scroller
// @ts-ignore module has no types :<
import { RecycleScroller } from "vue-virtual-scroller"
import TypoTitle from "~/components/typographic/title.vue"
import ProcessElement from "~/components/process/elementDisplay.vue"

import "vue-virtual-scroller/dist/vue-virtual-scroller.css"

import { RootState } from "~/store"

export default Vue.extend({
  components: {
    TypoTitle,
    ProcessElement,
  },
  computed: {
    ...mapState({
      PROCESSES: (state) => (<RootState>state).processes,
    })
  },
})
</script>

<style lang="scss" scoped></style>
