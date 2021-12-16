<template>
  <div class="tw-w-full tw-relative">
    <div
      class="tw-rounded-sm tw-cursor-pointer tw-w-full tw-px-4 tw-py-3 tw-border tw-border-solid tw-border-gray-400 tw-bg-gray-700 overflow-ellipsis tw-whitespace-nowrap tw-overflow-hidden"
      @click.stop="toggleDisplay"
    >
      <transition name="fade" mode="out-in">
        <span v-if="value" :key="value" class="tw-text-white">
          {{ value }}
        </span>
        <span v-else class="tw-text-gray-500">{{ placeholder }}</span>
      </transition>
    </div>
    <transition name="fade" mode="out-in">
      <div
        v-if="displayDropdown"
        class="dropDown"
        :class="{ reverseDropdownPosition }"
      >
        <div
          v-for="(option, index) in availableOptions"
          :key="index"
          class="element"
          :class="{ selected: option === value }"
          @click="selectValue(option)"
        >
          {{ option }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

export default Vue.extend({
  props: {
    placeholder: {
      type: String,
      default: "Please select a value",
    },
    availableOptions: {
      type: Array,
      required: true,
    } as PropOptions<(number | string)[]>,
    value: {
      type: [Number, String],
      required: true,
    },
    reverseDropdownPosition: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      displayDropdown: false,
    }
  },
  methods: {
    toggleDisplay(): void {
      this.displayDropdown = !this.displayDropdown
    },
    selectValue(option: number | string): void {
      this.$emit("input", option)
      this.displayDropdown = false
    },
  },
})
</script>

<style lang="scss" scoped>
.dropDown {
  @apply tw-border tw-border-solid tw-border-gray-400 tw-rounded-sm tw-z-30;
  @apply tw-max-h-64 tw-grid tw-grid-cols-1 tw-gap-0 tw-overflow-x-auto tw-absolute tw-bg-gray-700 tw-shadow-heavy tw-w-full;

  &.reverseDropdownPosition {
    bottom: calc(100% + theme("spacing.4"));
  }

  &:not(.reverseDropdownPosition) {
    top: calc(100% + theme("spacing.4"));
  }

  > .element {
    @apply tw-transition-colors tw-duration-150 tw-ease-in-out tw-bg-gray-700;
    @apply tw-cursor-pointer;
    @apply tw-p-4;

    &:hover {
      @apply tw-bg-gray-400;
    }

    &.selected {
      @apply tw-bg-blue-500;
    }
  }
}
</style>
