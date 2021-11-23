<template>
  <div class="btn" tabindex="0">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

})
</script>

<style lang="scss" scoped>
.btn {
  @apply tw-rounded tw-cursor-pointer tw-bg-blue-500 tw-text-white tw-font-semibold tw-p-4;
  @apply tw-transition tw-duration-150 tw-ease-in-out;
  &:focus() {
    @apply tw-outline-none;
  }

  &:hover {
    @apply tw-bg-blue-300;
  }
}
</style>
