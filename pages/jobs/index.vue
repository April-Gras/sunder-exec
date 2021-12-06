<template>
  <div>
    <TypoTitle>Job listing</TypoTitle>
    <div class="tw-grid tw-grid-gap-4">
      <div v-for="process in PROCESSES" :key="process.pid">{{ process }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"

import TypoTitle from "~/components/typographic/title.vue"

import { RootState } from "~/store"

export default Vue.extend({
  components: {
    TypoTitle,
  },
  computed: {
    ...mapState({
      PROCESSES: (state) => (<RootState>state).processes
    })
  }
})
</script>

<style lang="scss" scoped></style>
