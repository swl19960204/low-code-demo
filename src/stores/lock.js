import { defineStore } from 'pinia'
import { useCoreStore } from './core'

export const useLockStore = defineStore('lock', {
    actions: {
        lock() {
            const core = useCoreStore()
            core.curComponent.isLock = true
        },
        unlock() {
            const core = useCoreStore()
            core.curComponent.isLock = false
        }
    }
})
