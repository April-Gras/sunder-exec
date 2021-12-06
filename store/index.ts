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
    state.processes.push(process)
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }) {
    const processes = await this.$getApi("/currentProcesses")

    commit("SET_INITIAL_PROCESSES", processes)
  },
}
