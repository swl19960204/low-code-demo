import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', {
    state: () => ({
        // 页面全局数据
        canvasStyleData: {
            width: 1200,
            height: 740,
            scale: 100,
            color: '#000',
            opacity: 1,
            background: '#fff',
            fontSize: 14,
        },
        componentData: [], // 画布组件数据
    }),
    getters: {

    },
    actions: {
        addComponent(component, index) {
            if (index !== undefined) {
                this.componentData.splice(index, 0, component)
            } else {
                this.componentData.push(component)
            }
        }
    },
})
