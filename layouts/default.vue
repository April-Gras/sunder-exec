<template>
  <div class="tw-relative minHeightHandler">
    <div class="tw-bg-gray-600 tw-w-full tw-sticky tw-top-0 tw-z-10">
      <div class="outerWidthControl">
        <div class="mainWidthLimiter">
          <NuxtLink to="/">
            <img
              src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/84/84207be4c0db5dd637023062494a50781a9653af_full.jpg"
              class="
                tw-w-16
                tw-h-16
                tw-object-cover
                tw-overflow-hidden
                tw-rounded-full
              "
            />
          </NuxtLink>
          <NuxtLink to="/jobList"> Running Job List </NuxtLink>
        </div>
      </div>
    </div>
    <div class="mainContainer outerWidthControl">
      <div class="mainWidthLimiter">
        <div
          v-if="!isOnIndex"
          class="tw-mb-2 tw-cursor-pointer"
          @click="$router.go(-1)"
        >
          &larr; Previous Page
        </div>
        <Nuxt class="tw-w-full tw-relative" />
        <Terminal />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

import Terminal from "~/components/terminal/index.vue"

export default Vue.extend({
  components: {
    Terminal,
  },
  computed: {
    isOnIndex(): boolean {
      return this.$route.path === "/"
    },
  },
})
</script>

<style lang="scss" scoped>
.outerWidthControl {
  @apply tw-w-full tw-p-4 tw-text-white;

  @screen sm {
    @apply tw-p-6;
  }

  @screen lg {
    @apply tw-px-0;

    > .mainWidthLimiter {
      @apply tw-max-w-4xl tw-mx-auto;
    }
  }
}

.mainContainer {
  @apply tw-relative;
}

.minHeightHandler {
  @apply tw-bg-black;

  min-height: 100vh;
}
</style>
