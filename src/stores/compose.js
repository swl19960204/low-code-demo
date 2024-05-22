import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { getElement } from '../utils/dom'
import { generateID } from '@/utils'
import { createGroupStyle } from '@/utils/style'
import eventBus from '@/utils/eventBus'
import decomposeComponent from '@/utils/decomposeComp'
import { commonAttr, commonStyle } from '@/components/Custom/component-list'
import { useCoreStore } from './core'

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
        },
        compose() {
            const core = useCoreStore()
            let components = [];

            this.areaData.components.forEach(component => {
                if (component.component != 'Group') {
                    components.push(component)
                } else {
                    // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
                    const parentStyle = { ...component.style }
                    const subComponents = component.propValue
                    const editorRect = this.editor.getBoundingClientRect()

                    subComponents.forEach(component => {
                        decomposeComponent(component, editorRect, parentStyle)
                    })

                    components.push(...component.propValue)
                }
            })
            const groupComp = {
                id: generateID(),
                component: 'Group',
                label: '组合',
                icon: 'zuhe',
                ...commonAttr,
                style: {
                    ...commonStyle,
                    ...this.areaData.style,
                },
                propValue: components,
            }
            createGroupStyle(groupComp)

            core.addComp(groupComp);

            this.batchDeleteComponent(this.areaData.components);

            eventBus.emit('hideArea');

            core.setCurComponent({
                component: core.componentData[core.componentData.length - 1],
                index: core.componentData.length - 1,
            });
            this.areaData.components = []
        },
        batchDeleteComponent(deleteData) {
            const core = useCoreStore()
            deleteData.forEach(component => {
                for (let i = 0, len = core.componentData.length; i < len; i++) {
                    if (component.id == core.componentData[i].id) {
                        core.deleteComp(i);
                        break
                    }
                }
            })
        },
        decompose() {
            const core = useCoreStore()
            const parentStyle = { ...core.curComponent.style }
            const components = core.curComponent.propValue
            const editorRect = this.editor.getBoundingClientRect()

            core.deleteComp();
            components.forEach(component => {
                decomposeComponent(component, editorRect, parentStyle)
                core.addComp(component)
            })
        }
    },
})

