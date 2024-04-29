import { defineStore } from 'pinia'
import { useCoreStore } from './core'
import { swap } from '@/utils'

export const useLayerStore = defineStore('layer', {
  state: () => ({}),
  actions: {
    up() {
      const core = useCoreStore()
      if (core.curComponentIndex < core.componentData.length - 1) {
        swap(core.componentData, core.curComponentIndex, core.curComponentIndex + 1)
        core.curComponentIndex += 1
      }
    },
    down() {
      const core = useCoreStore()
      if (core.curComponentIndex > 0) {
        swap(core.componentData, core.curComponentIndex, core.curComponentIndex - 1)
        core.curComponentIndex -= 1
      }
    }
  }
})
