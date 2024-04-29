<script setup>
import { ref, reactive, onMounted } from 'vue'
// import { storeToRefs } from 'pinia'
import { useCoreStore } from '../../stores/core'
import { useComposeStore } from '../../stores/compose'
import Grid from './Grid.vue'
import ContextMenu from './ContextMenu.vue'
import MarkLine from './MarkLine.vue'
import Area from './Area.vue'
import Shape from './Shape.vue'
import { getCanvasStyle, getStyle, getShapeStyle } from '../../utils/style'
import { changeStyleWithScale } from '../../utils/translate'
defineProps({
    isEdit: {
        type: Boolean,
        default: true,
    },
})
const isShowArea = ref(false)
const width = ref(0)
const height = ref(0)
const start = reactive({
    x: 0,
    y: 0,
})
const svgFilterAttrs = ['width', 'height', 'top', 'left', 'rotate'];

const coreStore = useCoreStore();
const composeStore = useComposeStore();
// const { canvasStyleData, componentData } = storeToRefs(coreStore)


function handleContextMenu() {

}

function handleMouseDown() {

}

function getComponentStyle(style) {
    return getStyle(style, svgFilterAttrs)
}



onMounted(() => {
    composeStore.setEditor();
})
</script>

<template>
    <div id="editor" class="editor" :class="{ edit: isEdit }" :style="{
        ...getCanvasStyle(coreStore.canvasStyleData),
        width: changeStyleWithScale(coreStore.canvasStyleData.width, coreStore.canvasStyleData.scale) + 'px',
        height: changeStyleWithScale(coreStore.canvasStyleData.height, coreStore.canvasStyleData.scale) + 'px',
    }" @contextmenu="handleContextMenu" @mousedown="handleMouseDown">
        <!-- 网格线  :is-dark-mode="isDarkMode" -->
        <Grid />

        <!--页面组件列表展示 -->
        <Shape v-for="(item, index) in coreStore.componentData" :key="item.id" :element="item"
            :style="getShapeStyle(item.style)" :default-style="item.style" :index="index" :class="{ lock: item.isLock }"
            :active="item.id === (coreStore.curComponent || {}).id">

            <component :is="item.component" :id="`component-${item.id}`" class="component"
                :style="getComponentStyle(item.style)" :prototies="item.propValue" :element="item"
                :request="item.request" />

        </Shape>
        <!-- 右击菜单 -->
        <ContextMenu />

        <!-- 标线 -->
        <MarkLine />

        <!-- 选中区域 -->
        <Area v-show="isShowArea" :start="start" :width="width" :height="height" />
    </div>
</template>


<style lang="less" scoped>
.editor {
    position: relative;
    background: #fff;
    margin: auto;

    .lock {
        opacity: .5;

        &:hover {
            cursor: not-allowed;
        }
    }
}


.edit {
    .component {
        outline: none;
        width: 100%;
        height: 100%;
    }
}
</style>
