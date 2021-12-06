<template>
  <div>
    <TypoTitle>Directory listing</TypoTitle>
    <div class="tw-mb-2 tw-font-bold tw-text-lg">
      target: {{ directoryPath }}
    </div>
    <div
      class="
        tw-grid
        tw-cols-1
        tw-gap-2
        tw-pl-4
        tw-ml-2
        tw-border-0
        tw-border-l
        tw-border-solid
        tw-border-gray-300
      "
    >
      <div
        v-for="file in fileNameArray"
        :key="file"
        class="
          sm:tw-flex
          tw-justify-between
          tw-items-center
          tw-transition-colors
          tw-duration-150
          tw-ease-in-out
          hover:tw-bg-gray-700
          tw-p-2 tw-rounded
        "
      >
        <div class="tw-mb-2 sm:tw-mb-0">
          {{ file }}
        </div>
        <ButtonMain @click.native="launchProgram(file)"> Launch </ButtonMain>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VueMixins from "vue-typed-mixins"
import { mapMutations } from "vuex"

import { PostReturnPayloadDescriptor } from "module-routes"
import TypoTitle from "~/components/typographic/title.vue"
import ButtonMain from "~/components/ui/buttons/main.vue"

type _AsyncData = PostReturnPayloadDescriptor["/readTargetDirectory"]

export default VueMixins().extend({
  components: {
    TypoTitle,
    ButtonMain,
  },
  async asyncData({ route, $postApi, error }) {
    const targetDirectory = decodeURI(
      route.fullPath.substring("/directory/".length - 1)
    )

    try {
      return await $postApi("/readTargetDirectory", {
        targetDirectory,
      })
    } catch (_err) {
      error({
        message: "Bruh please stop lmfao",
        statusCode: 404,
      })
    }
  },
  data() {
    const out = {}

    return out as typeof out & _AsyncData
  },
  methods: {
    ...mapMutations({
      ADD_PROCESS_DEFINITION: "ADD_PROCESS_DEFINITION",
    }),
    launchProgram(fileName: string): void {
      this.$postApi("/execTargetContext", {
        directoryPath: this.directoryPath,
        fileName,
      }).then((processDefinition) => {
        this.ADD_PROCESS_DEFINITION(processDefinition)
      })
    },
  },
})
</script>
