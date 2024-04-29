<script setup>
import { useCoreStore } from '../stores/core'
import { useLayerStore } from '../stores/layer'
import { useSnapshotStore } from '../stores/snapshot'
const coreStore = useCoreStore();
const layerStore = useLayerStore();
const snapShotStore = useSnapshotStore();
const handleItemClick = (index) => {
    console.log("🚀 ~ handleItemClick ~ index:", index)
    // TODO: 显示右侧属性列表
    coreStore.setCurComponent({ component: coreStore.componentData[index], index })
}

const upComponent = () => {
    layerStore.up();
    snapShotStore.recordSnapshot();
}

const downComponent = () => {
    layerStore.down();
    snapShotStore.recordSnapshot();
}
const deleteComponent = () => {
    setTimeout(() => {
        coreStore.deleteComp();
        snapShotStore.recordSnapshot();
    })
}

const transformIndex = (index) => {
    return coreStore.componentData.length - 1 - index
}

const getComponent = (index) => {
    return coreStore.componentData[coreStore.componentData.length - 1 - index]
}
</script>

<template>
    <div class="real-component-list">
        <div v-for="(item, index) in coreStore.componentData" :key="index" class="real-component-list_item"
            :class="{ actived: transformIndex(index) === coreStore.curComponentIndex }"
            @click="handleItemClick(transformIndex(index))">
            <span class="iconfont" :class="'icon-' + getComponent(index).icon"></span>
            <span>{{ getComponent(index).label }}</span>
            <div class="extra">
                <span class="iconfont icon-shangyi" @click="upComponent(transformIndex(index))"></span>
                <span class="iconfont icon-xiayi" @click="downComponent(transformIndex(index))"></span>
                <span class="iconfont icon-shanchu" @click="deleteComponent(transformIndex(index))"></span>
            </div>
        </div>
    </div>
</template>


<style lang="less" scoped>
.real-component-list {
    height: 35%;
    overflow: auto;

    &_item {
        height: 30px;
        cursor: grab;
        text-align: center;
        color: #333;
        display: flex;
        align-items: center;
        font-size: 12px;
        padding: 0 10px;
        position: relative;
        user-select: none;
        opacity: 1;

        &:active {
            cursor: grabbing;
        }

        &:hover {
            background-color: rgba(200, 200, 200, .2);

            .extra {
                display: block;
            }
        }

        .iconfont {
            margin-right: 4px;
            font-size: 16px;
        }

        .icon-wenben,
        .icon-tupian {
            font-size: 14px;
        }

        .extra {
            position: absolute;
            right: 10px;
            display: none;

            .iconfont {
                cursor: pointer;
            }
        }
    }

    .actived {
        background: #ecf5ff;
        color: #409eff;
    }
}
</style>