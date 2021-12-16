import { MutationTree, ActionTree } from "vuex"
import { ClientSideProcessDefinition } from "~/types/clientSideProcessDefinition"

export const state = () => ({
  processes: [] as ClientSideProcessDefinition[],
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SET_INITIAL_PROCESSES(state, processes: ClientSideProcessDefinition[]) {
    state.processes.push(...processes)
  },
  ADD_PROCESS_DEFINITION(state, process: ClientSideProcessDefinition) {
    if (state.processes.every((e) => e.uid !== process.uid))
      state.processes.push(process)
    // TODO Should we handle duplicate addition ?
  },
  UPDATE_PROCESS_DEFINITION(state, process: ClientSideProcessDefinition) {
    const targetIndex = state.processes.findIndex(
      ({ uid }) => process.uid === uid
    )

    if (targetIndex !== -1) state.processes.splice(targetIndex, 1, process)
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }) {
    const processes = await this.$getApi("/currentProcesses")

    commit("SET_INITIAL_PROCESSES", processes)
  },
}
