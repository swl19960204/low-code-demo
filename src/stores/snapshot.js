import { defineStore } from 'pinia'
import { useCoreStore } from './core'
import { cloneDeep } from 'lodash-es';

export const useSnapshotStore = defineStore('snapshot', {
    state: () => ({
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引
    }),
    getters: {

    },
    actions: {
        recordSnapshot() {
            const core = useCoreStore();
            // 添加新的快照
            this.snapshotData[++this.snapshotIndex] = cloneDeep(core.componentData)
            // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
            if (this.snapshotIndex < this.snapshotData.length - 1) {
                this.snapshotData = this.snapshotData.slice(0, this.snapshotIndex + 1)
            }
        }
    },
})
