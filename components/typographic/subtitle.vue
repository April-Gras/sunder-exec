<template>
  <div class="tw-mb-4">
    <h1 class="text tw-mb-1 tw-inline-block">
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
  @apply tw-text-gray-100 tw-text-base tw-font-medium tw-font-main;
}

.bottomLine {
  @apply tw-w-12 tw-h-1 tw-rounded-full tw-bg-blue-300;

  animation-duration: 5s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-name: "pulseColor";
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}
</style>
<style lang="scss">
@keyframes pulseColor {
  from {
    @apply tw-bg-blue-300;
  }
  to {
    @apply tw-bg-blue-100;
  }
}
</style>
