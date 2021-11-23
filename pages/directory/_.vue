<template>
  <div>
    <TypoTitle>Directory listing</TypoTitle>
    <div class="tw-mb-2 tw-font-bold tw-text-lg">
      target: {{ config.directoryPath }}
    </div>
    <div class="tw-grid tw-cols-1 tw-gap-2 tw-pl-4 tw-ml-2 tw-border-0 tw-border-l tw-border-solid tw-border-gray-300">
      <div v-for="file in config.fileNameArray" :key="file" class="sm:tw-flex tw-justify-between tw-items-center tw-transition-colors tw-duration-150 tw-ease-in-out hover:tw-bg-gray-700 tw-p-2 tw-rounded">
        <div class="tw-mb-2 sm:tw-mb-0">
          {{ file }}
        </div>
        <ButtonMain @click.native="emitTest({ directoryPath: config.directoryPath, fileName: file })">
          Launch
        </ButtonMain>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VueMixins from 'vue-typed-mixins'

import TypoTitle from '~/components/typographic/title.vue'
import ButtonMain from '~/components/ui/buttons/main.vue'

import clientIoMixin from '~/mixins/clientIo'

export default VueMixins(clientIoMixin).extend({
  components: {
    TypoTitle, ButtonMain
  },
  async asyncData ({ params, $axios, error }) {
    const directoryPath = `/${params.pathMatch}`

    try {
      return {
        config: await $axios.$post('/read-target-directory', {
          directoryPath
        })
      }
    } catch (err) {
      console.log(err)
      error({
        message: 'Bruh please stop lmfao',
        statusCode: 404
      })
    }
  },
  methods: {
    emitTest ({ directoryPath, fileName }: { directoryPath: string, fileName: string }): void {
      this.socketEmit('launchScript', {
        fileName, directoryPath
      })
    },
    postSocketInit () {
      this.socketListen('confirmScriptLaunch', (payload) => {
        console.log(payload.directoryPath, payload.fileName)
      })
    }
  }
})
</script>
