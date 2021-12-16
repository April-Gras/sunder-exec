<template>
  <div class="tw-relative">
    <Terminal :inspected-process="target">
      <template #header>
        <ProcessElement :process="target.process" />
      </template>
      <template #footer>
        <ProcessSendSignal :process="target.process" />
      </template>
    </Terminal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapState } from "vuex"

import ProcessElement from "~/components/process/elementDisplay.vue"
import ProcessSendSignal from "~/components/process/sendSignals.vue"
import Terminal from "~/components/terminal/index.vue"

import { PostReturnPayloadDescriptor } from "module-routes"
import {
  ClientSideProcessDefinition,
  ClientSideProcessLog,
} from "~/types/clientSideProcessDefinition"
import { RootState } from "~/store"

type _AsyncData = {
  logs: ClientSideProcessLog
  targetUid: ClientSideProcessDefinition["uid"]
}

export default Vue.extend({
  components: {
    Terminal,
    ProcessElement,
    ProcessSendSignal,
  },
  async asyncData({
    $postApi,
    error,
    params,
    store,
  }): Promise<_AsyncData | void> {
    try {
      const inspectedProcess = await $postApi("/processByUid", {
        uid: params.uid,
      })
      const state: RootState = store.state

      if (state.processes.some((e) => e.uid === params.uid)) {
        store.commit("UPDATE_PROCESS_DEFINITION", inspectedProcess.process)
        return {
          targetUid: inspectedProcess.process.uid,
          logs: inspectedProcess.logs,
        }
      } else {
        error({
          message: "Missmatch between local and server :<",
          statusCode: 404,
        })
      }
    } catch (err) {
      error({
        message: "Process not found",
        statusCode: 404,
      })
    }
  },
  data() {
    const out = {}

    return out as typeof out & _AsyncData
  },
  computed: {
    ...mapState({
      AVAILABLE_PROCESSES: (state) => (<RootState>state).processes
    }),
    target(): PostReturnPayloadDescriptor["/processByUid"] {
      const localProcessDefinition = this.AVAILABLE_PROCESSES.find((e) => e.uid === this.targetUid)

      if (!localProcessDefinition)
        throw "Missing local process definition"
      else return {
        logs: this.logs,
        process: localProcessDefinition
      }
    }
  },
})
</script>

<style lang="scss" scoped></style>
