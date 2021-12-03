<template>
  <div class="tw-rounded-lg tw-mt-12">
    <div v-if="Object.keys(tabs).length > 0" id="tabWrapAnchor" class="tabWrap">
      <div
        v-for="({ fileName }, uid) in tabs"
        :id="uid"
        :key="uid"
        class="tab"
        :class="{ selected: selectedTabUid === uid }"
        @click="selectedTabUid = uid"
      >
        <span>{{ fileName }} - {{ uid }}</span>
        <span
          class="tw-font-bold tw-text-sm tw-inline-block"
          @click.stop="removeUid(uid)"
          >x</span
        >
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div
        v-if="selectedTabUid !== null && tabs[selectedTabUid]"
        :key="selectedTabUid"
        class="output"
      >
        <span
          v-for="({ text, type }, index) in tabs[selectedTabUid].output"
          :key="index"
          :class="type"
          >{{ text }}</span
        >
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import VueMixins from "vue-typed-mixins"

import clientIoMixin from "~/mixins/clientIo"

interface TabConfig {
  directoryPath: string
  fileName: string
  output: {
    text: string
    type: "out" | "err"
  }[]
  uid: string
}

export default VueMixins(clientIoMixin).extend({
  data() {
    return {
      tabs: {} as Record<
        string,
        {
          directoryPath: string
          fileName: string
          output: {
            text: string
            type: "out" | "err"
          }[]
          uid: string
        }
      >,
      selectedTabUid: null as null | string,
    }
  },
  methods: {
    postSocketInit() {
      this.socketListen("streamData", (payload) => {
        if (!this.tabs[payload.uid]) {
          const buildConfig = {
            directoryPath: payload.directoryPath,
            fileName: payload.fileName,
            output: [
              {
                text: payload.text,
                type: payload.type,
              },
            ],
            uid: payload.uid,
          } as TabConfig

          this.$set(this.tabs, payload.uid, buildConfig)
          this.selectedTabUid = payload.uid
        } else {
          this.tabs[payload.uid].output.push({
            text: payload.text,
            type: payload.type,
          })
        }
      })
    },
    removeUid(uid: string): void {
      if (this.tabs[uid]) {
        this.$delete(this.tabs, uid)
      }
    },
  },
  watch: {
    selectedTabUid() {
      this.$nextTick(() => {
        if (this.selectedTabUid) {
          const target = document.getElementById(this.selectedTabUid)
          const anchor = document.getElementById("tabWrapAnchor")

          if (target && anchor) {
            const offsetLeft = target.offsetLeft

            anchor.scrollTo({
              behavior: "smooth",
              left: offsetLeft,
            })
          }
        }
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.output {
  @apply tw-overflow-x-auto tw-p-4 tw-bg-darkest;
  @apply tw-border tw-border-solid tw-border-t-0 tw-border-white;

  @screen sm {
    @apply tw-p-6;
  }
}

.tabWrap {
  @apply tw-overflow-x-auto tw-relative tw-border-0 tw-border-solid tw-border-b tw-border-white tw-flex tw-justify-start tw-gap-2;

  > .tab {
    @apply tw-rounded-tl tw-cursor-pointer tw-rounded-tr tw-overflow-hidden tw-bg-darkest tw-py-2 tw-px-6 tw-transition-colors tw-duration-150 tw-ease-in-out;
    @apply tw-border-solid tw-border tw-border-b-0 tw-border-white;
    @apply tw-flex-shrink-0;

    &.selected {
      @apply tw-bg-gray-200 tw-text-black;

      &:hover {
        @apply tw-bg-gray-300;
      }
    }
    &:hover {
      @apply tw-bg-black;
    }
  }
}

.err {
  @apply tw-text-error tw-font-medium tw-whitespace-pre;
}

.out {
  @apply tw-whitespace-pre;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
