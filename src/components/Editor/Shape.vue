<script setup>
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

</script>

<template>
    <div class="shape" :class="{ active }" @click="selectCurComponent" @mousedown="handleMouseDownOnShape">
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
</style>
