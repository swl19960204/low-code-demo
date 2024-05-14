import { defineStore } from 'pinia'
import { getElement } from '../utils/dom'

export const useComposeStore = defineStore('compose', {
    state: () => ({
        areaData: { // 选中区域包含的组件以及区域位移信息
            style: {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            },
            components: [],
        },
        editor: null,
    }),
    getters: {

    },
    actions: {
        setEditor() {
            this.editor = getElement('#editor')
        },
        setAreaData(data) {
            this.areaData = data
        }
    },
})
