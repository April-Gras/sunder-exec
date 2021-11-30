<template>
  <div class="tw-mb-6">
    <h1 class="text tw-mb-2 tw-inline-block">
      <slot />
    </h1>
    <div class="bottomLine" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.text {
  @apply tw-text-gray-100 tw-text-4xl tw-font-bold tw-font-main;
}

.bottomLine {
  @apply tw-w-12 tw-h-2 tw-rounded-full tw-bg-blue-300;

  animation-duration: 5s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-name: "pulseWidth";
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}
</style>
<style lang="scss">
@keyframes pulseWidth {
  from {
    @apply tw-w-12;
  }
  to {
    @apply tw-w-20;
  }
}
</style>
