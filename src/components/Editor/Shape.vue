<script setup>
import { computed, reactive } from 'vue'
import { useCoreStore } from '../../stores/core'
import { useSnapshotStore } from '../../stores/snapshot'
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    defaultStyle: {
        required: true,
        type: Object,
        default: () => { },
    },
    element: {
        required: true,
        type: Object,
        default: () => { },
    },
    index: {
        required: true,
        type: [Number, String],
        default: 0,
    },
})

const pointList = reactive(['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'])
// 线只有两个方向
const pointList2 = reactive(['r', 'l'])


const isActive = computed(() => {
    return props.active && !props.element.isLock
})
const getPointList = computed(() => {
    return props.element.component === 'line-shape' ? pointList2 : pointList
})

const coreStore = useCoreStore()
const snapshotStore = useSnapshotStore()

function selectCurComponent(e) {
    // 阻止向父组件冒泡
    e.stopPropagation()
    e.preventDefault()
}
function handleMouseDownOnShape(e) {
    e.stopPropagation();
    coreStore.setCurComponent({ component: props.element, index: props.index })

    const pos = { ...props.defaultStyle }

    const startY = e.clientY
    const startX = e.clientX

    // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
    const startTop = Number(pos.top)
    const startLeft = Number(pos.left)

    let hasMove = false;
    const move = (moveEvent) => {
        hasMove = true;
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        pos.top = curY - startY + startTop;
        pos.left = curX - startX + startLeft;

        coreStore.setShapeStyle(pos);
    }
    const up = (upEvent) => {
        hasMove && snapshotStore.recordSnapshot();

        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
    }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
}

function handleRotate(e) {

}

function getPointStyle(point) {
    const { width, height } = props.defaultStyle
    const hasT = /t/.test(point)
    const hasB = /b/.test(point)
    const hasL = /l/.test(point)
    const hasR = /r/.test(point)

    let newLeft = 0
    let newTop = 0
    // 四个角的点
    if (point.length === 2) {
        newLeft = hasL ? 0 : width
        newTop = hasT ? 0 : height
    } else {
        // 上下两点的点，宽度居中
        if (hasT || hasB) {
            newLeft = Math.floor(width / 2);
            newTop = hasT ? 0 : height
        }

        // 左右两边的点，高度居中
        if (hasL || hasR) {
            newLeft = hasL ? 0 : width
            newTop = Math.floor(height / 2)
        }
    }


    const style = {
        marginLeft: '-4px',
        marginTop: '-4px',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        // cursor: cursors[point],
    }

    return style
}


function handleMouseDownOnPoint(point, e) {
    e.stopPropagation()
    e.preventDefault()

}

</script>

<template>
    <div class="shape" :class="{ active }" @click="selectCurComponent" @mousedown="handleMouseDownOnShape">
        <span v-show="isActive" class="iconfont icon-xiangyouxuanzhuan" @mousedown="handleRotate"></span>
        <div v-for="item in (isActive ? getPointList : [])" :key="item" class="shape-point" :style="getPointStyle(item)"
            @mousedown="handleMouseDownOnPoint(item, $event)">
        </div>
        <slot></slot>
    </div>
</template>


<style lang="less" scoped>
.shape {
    position: absolute;

    &:hover {
        cursor: move;
    }
}

.active {
    outline: 1px solid #70c0ff;
    user-select: none;
}

.shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    z-index: 1;
}

.icon-xiangyouxuanzhuan {
    position: absolute;
    top: -34px;
    left: 50%;
    transform: translateX(-50%);
    cursor: grab;
    color: #59c7f9;
    font-size: 20px;
    font-weight: 600;

    &:active {
        cursor: grabbing;
    }
}
</style>
