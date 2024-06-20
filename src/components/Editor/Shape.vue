<script setup>
import { computed, reactive, ref, nextTick, onMounted } from 'vue'
import { useCoreStore } from '../../stores/core'
import { useSnapshotStore } from '../../stores/snapshot'
import { useComposeStore } from '../../stores/compose'
import calculateComponentPositonAndSize from '../../utils/calculateComponentPositonAndSize'
import eventBus from '@/utils/eventBus'
import { mod360 } from '@/utils/translate'
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
const rootRef = ref(null);
// 每个点对应的初始角度
const initialAngle = reactive({
    lt: 0,
    t: 45,
    rt: 90,
    r: 135,
    rb: 180,
    b: 225,
    lb: 270,
    l: 315,
})
// 每个范围的角度对应的光标
const angleToCursor = reactive([
    { start: 338, end: 23, cursor: 'nw' },
    { start: 23, end: 68, cursor: 'n' },
    { start: 68, end: 113, cursor: 'ne' },
    { start: 113, end: 158, cursor: 'e' },
    { start: 158, end: 203, cursor: 'se' },
    { start: 203, end: 248, cursor: 's' },
    { start: 248, end: 293, cursor: 'sw' },
    { start: 293, end: 338, cursor: 'w' },
])
let cursors = ref({});

const isActive = computed(() => {
    return props.active && !props.element.isLock
})
const getPointList = computed(() => {
    return props.element.component === 'line-shape' ? pointList2 : pointList
})

const coreStore = useCoreStore()
const snapshotStore = useSnapshotStore()
const composeStore = useComposeStore()

function selectCurComponent(e) {
    // 阻止向父组件冒泡
    e.stopPropagation()
    e.preventDefault()
}

function handleMouseDownOnShape(e) {
    // 将当前点击组件的事件传播出去，目前的消费是 VText 组件
    nextTick(() => {
        eventBus.emit('componentClick')
    })
    e.stopPropagation();
    coreStore.setClickOutSideCompStatus(true);
    coreStore.setCurComponent({ component: props.element, index: props.index })
    if (props.element.isLock) return

    cursors.value = getCursor() // 根据旋转角度获取光标位置
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
        // 如果不使用 $nextTick，吸附后将无法移动
        nextTick(() => {
            // 后面两个参数代表鼠标移动方向
            // curY - startY > 0 true 表示向下移动 false 表示向上移动
            // curX - startX > 0 true 表示向右移动 false 表示向左移动
            eventBus.emit('move', curY - startY > 0, curX - startX > 0)
        })
    }
    const up = () => {
        hasMove && snapshotStore.recordSnapshot();
        // 触发元素停止移动事件，用于隐藏标线
        eventBus.emit('unmove')
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
    }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
}

function handleRotate(e) {
    coreStore.setClickOutSideCompStatus(true);
    e.preventDefault()
    e.stopPropagation()

    // 初始坐标和初始角度
    const pos = { ...props.defaultStyle }
    const startY = e.clientY
    const startX = e.clientX
    const startRotate = pos.rotate
    // 获取元素中心点位置
    const rect = rootRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // 旋转前的角度
    const rotateBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)
    // 如果元素没有移动，则不保存快照
    let hasRotate = false;
    const move = (moveEvent) => {
        hasRotate = true;
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        // 旋转后的角度
        const rotateAfter = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)
        // 获取旋转的角度值
        pos.rotate = startRotate + rotateAfter - rotateBefore

        coreStore.setShapeStyle(pos);
    }
    const up = () => {
        hasRotate && snapshotStore.recordSnapshot();
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
        cursors.value = getCursor() // 根据旋转角度获取光标位置
    }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
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
        cursor: cursors.value[point],
    }

    return style
}


function handleMouseDownOnPoint(point, e) {
    e.stopPropagation()
    e.preventDefault()
    coreStore.setClickOutSideCompStatus(true);

    const style = { ...props.defaultStyle }
    // 组件宽高比
    const aspectRatio = style.width / style.height;

    // 组件中心点
    const center = {
        x: style.left + style.width / 2,
        y: style.top + style.height / 2,
    }
    const editorRectInfo = composeStore.editor.getBoundingClientRect()
    // 获取 point 与实际拖动基准点的差值
    const pointRect = e.target.getBoundingClientRect()

    // 当前点击圆点相对于画布的中心坐标
    const curPoint = {
        x: Math.round(pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2),
        y: Math.round(pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2),
    }

    // 获取对称点的坐标
    const symmetricPoint = {
        x: center.x - (curPoint.x - center.x),
        y: center.y - (curPoint.y - center.y),
    }

    let needSave = false
    let isFirst = true

    const needLockProportion = isNeedLockProportion();
    const move = (moveEvent) => {
        // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
        // 因此第一次点击时不触发 move 事件
        if (isFirst) {
            isFirst = false
            return
        }
        needSave = true;

        const curPositon = {
            x: moveEvent.clientX - Math.round(editorRectInfo.left),
            y: moveEvent.clientY - Math.round(editorRectInfo.top),
        }

        calculateComponentPositonAndSize(point, style, curPositon, aspectRatio, needLockProportion, {
            center,
            curPoint,
            symmetricPoint,
        })

        coreStore.setShapeStyle(style);
    }
    const up = () => {
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
        needSave && snapshotStore.recordSnapshot();
    }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
}

function getCursor() {
    const rotate = mod360(coreStore.curComponent.style.rotate) // 取余 360
    const result = {}
    let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度
    pointList.forEach(point => {
        const angle = mod360(initialAngle[point] + rotate)
        const len = angleToCursor.length
        while (true) {
            lastMatchIndex = (lastMatchIndex + 1) % len
            const angleLimit = angleToCursor[lastMatchIndex]

            if (angle < 23 || angle >= 338) {
                result[point] = 'nw-resize'
                return
            }

            if (angleLimit.start <= angle && angle < angleLimit.end) {
                result[point] = angleLimit.cursor + '-resize'
                return
            }
        }

    })
    return result
}


function isNeedLockProportion() {
    if (props.element.component != 'Group') return false
    // const ratates = [0, 90, 180, 360]
    // for (const component of this.element.propValue) {
    //     if (!ratates.includes(mod360(parseInt(component.style.rotate)))) {
    //         return true
    //     }
    // }

    // return false
}

onMounted(() => {
    // 用于 Group 组件
    if (coreStore.curComponent) {
        cursors.value = getCursor();
    }
})

</script>

<template>
    <div ref="rootRef" class="shape" :class="{ active }" @click="selectCurComponent"
        @mousedown="handleMouseDownOnShape">
        <span v-show="isActive" class="iconfont icon-xiangyouxuanzhuan" @mousedown="handleRotate"></span>
        <span v-show="element.isLock" class="iconfont icon-suo"></span>
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

.icon-suo {
    position: absolute;
    top: 0;
    right: 0;
}
</style>
