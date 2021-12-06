<template>
  <div class="tw-flex tw-justify-start tw-items-start tw-gap-2">
    <div>Process list</div>
    <transition name="scale" mode="out-in">
      <div :key="PROCESS_COUNT">{{ PROCESS_COUNT }}</div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"

import { RootState } from "~/store"

export default Vue.extend({
  computed: {
    ...mapState({ PROCESS_COUNT: (state) => (<RootState>state).processes.length })
  }
})
</script>

<style lang="scss" scoped>
.scale-enter-active, .scale-leave-active {
  @apply tw-transition tw-duration-150 tw-ease-in-out tw-translate-y-0;
}
.scale-enter, .scale-leave-to {
  @apply tw-opacity-0;

  transform: translateY(-20px) rotate(90deg);
  filter: blur(3px);
}
</style>