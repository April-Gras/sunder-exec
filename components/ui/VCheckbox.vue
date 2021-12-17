<template>
  <div
    class="checkboxWrapper tw-select-none"
    :class="{ selected }"
    @click="toggle"
  >
    <transition name="fade" mode="out-in">
      <span v-if="selected" class="tw-text-2xl">✓</span>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

export default Vue.extend({
  props: {
    value: {
      type: Array,
      required: true,
    } as PropOptions<(number | string)[]>,
    target: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    selected(): boolean {
      return this.value.includes(this.target)
    },
  },
  methods: {
    toggle(): void {
      if (this.selected)
        this.$emit(
          "input",
          this.value.filter((e) => e !== this.target)
        )
      else this.$emit("input", [...this.value, this.target])
    },
  },
})
</script>

<style lang="scss" scoped>
.checkboxWrapper {
  @apply tw-w-6 tw-h-6 tw-relative tw-flex tw-justify-center tw-items-center tw-bg-gray-600 tw-rounded-sm tw-cursor-pointer;
  @apply tw-border tw-border-solid tw-border-gray-400;
  @apply tw-transition-colors tw-duration-150 tw-ease-in-out;

  &.selected {
    @apply tw-bg-blue-600 tw-border-blue-600;
  }
}
</style>
