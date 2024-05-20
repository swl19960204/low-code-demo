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
import { getCanvasStyle, getStyle, getShapeStyle, getComponentRotatedStyle } from '../../utils/style'
import { changeStyleWithScale } from '../../utils/translate'
import eventBus from '@/utils/eventBus'
defineProps({
    isEdit: {
        type: Boolean,
        default: true,
    },
})
const isShowArea = ref(false)
const width = ref(0)
const height = ref(0)
const editorX = ref(0)
const editorY = ref(0)
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

function hideArea() {
    isShowArea.value = false;
    width.value = 0
    height.value = 0
    composeStore.setAreaData({
        style: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        },
        components: [],
    })
}

function getSelectArea() {
    const result = []
    // 区域起点坐标
    const { x, y } = start
    const { value: areaWidth } = width;
    const { value: areaHeight } = height;
    coreStore.componentData.forEach(component => {
        if (component.isLock) return
        const { left, top, width, height } = getComponentRotatedStyle(component.style)
        if (x <= left && y <= top && (left + width <= x + areaWidth) && (top + height <= y + areaHeight)) {
            result.push(component)
        }
    })
    return result
}


function createGroupArea() {
    // 获取选中区域的组件数据
    const areaData = getSelectArea()
    if (areaData.length <= 1) {
        hideArea()
        return;
    }
    // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
    // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
    let top = Infinity, left = Infinity
    let right = -Infinity, bottom = -Infinity
    areaData.forEach(component => {
        let style = {}
        // if (component.component == 'Group') {
        //     component.propValue.forEach(item => {
        //         const rectInfo = $(`#component${item.id}`).getBoundingClientRect()
        //         style.left = rectInfo.left - editorX
        //         style.top = rectInfo.top - editorY
        //         style.right = rectInfo.right - editorX
        //         style.bottom = rectInfo.bottom - editorY

        //         if (style.left < left) left = style.left
        //         if (style.top < top) top = style.top
        //         if (style.right > right) right = style.right
        //         if (style.bottom > bottom) bottom = style.bottom
        //     })
        // } else {
        style = getComponentRotatedStyle(component.style)
        // }

        if (style.left < left) left = style.left
        if (style.top < top) top = style.top
        if (style.right > right) right = style.right
        if (style.bottom > bottom) bottom = style.bottom
    })

    start.x = left
    start.y = top
    width.value = right - left
    height.value = bottom - top

    composeStore.setAreaData({
        style: {
            left,
            top,
            width: width.value,
            height: height.value
        },
        components: areaData
    })
}

function handleMouseDown(e) {
    if (!coreStore.curComponent) {
        e.preventDefault()
    }
    hideArea();

    const rectInfo = composeStore.editor.getBoundingClientRect()
    editorX.value = rectInfo.x
    editorY.value = rectInfo.y

    const startX = e.clientX
    const startY = e.clientY

    start.x = startX - editorX.value
    start.y = startY - editorY.value
    // 展示选中区域
    isShowArea.value = true
    const move = (moveEvent) => {
        width.value = Math.abs(moveEvent.clientX - startX)
        height.value = Math.abs(moveEvent.clientY - startY)

        if (moveEvent.clientX < startX) {
            start.x = moveEvent.clientX - editorX.value
        }

        if (moveEvent.clientY < startY) {
            start.y = moveEvent.clientY - editorY.value
        }
    }
    const up = (upEvent) => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)

        if (upEvent.clientX == startX && upEvent.clientY == startY) {
            hideArea();
            return
        }
        createGroupArea()
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
}

function getComponentStyle(style) {
    return getStyle(style, svgFilterAttrs)
}



onMounted(() => {
    composeStore.setEditor();

    eventBus.on('hideArea', () => {
        hideArea()
    })
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
