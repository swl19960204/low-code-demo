<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useCoreStore } from '@/stores/core'
import eventBus from '@/utils/eventBus'
import { getComponentRotatedStyle } from '@/utils/style'
const lines = reactive(['xt', 'xc', 'xb', 'yl', 'yc', 'yr'])
const diff = ref(3) // 相距 dff 像素将自动吸附
const lineStatus = reactive({
    xt: false,
    xc: false,
    xb: false,
    yl: false,
    yc: false,
    yr: false,
})
const lineRefs = new Array(lines.length).fill();
const coreStore = useCoreStore()

function showLine(isDownward, isRightward) {
    const components = coreStore.componentData;
    const curComponentStyle = getComponentRotatedStyle(coreStore.curComponent.style)
    const curComponentHalfwidth = curComponentStyle.width / 2
    const curComponentHalfHeight = curComponentStyle.height / 2

    hideLine();
    components.forEach((component) => {
        if (component == coreStore.curComponent) return
        const componentStyle = getComponentRotatedStyle(component.style)
        const { top, left, bottom, right } = componentStyle

        const componentHalfwidth = componentStyle.width / 2
        const componentHalfHeight = componentStyle.height / 2

        const conditions = {
            top: [
                {
                    isNearly: isNearly(curComponentStyle.top, top),
                    lineNode: lineRefs[0], // xt
                    line: 'xt',
                    dragShift: top,
                    lineShift: top,
                },
                {
                    isNearly: isNearly(curComponentStyle.bottom, top),
                    lineNode: lineRefs[0], // xt
                    line: 'xt',
                    dragShift: top - curComponentStyle.height,
                    lineShift: top,
                },
                {
                    // 组件与拖拽节点的中间是否对齐
                    isNearly: isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
                    lineNode: lineRefs[1], // xc
                    line: 'xc',
                    dragShift: top + componentHalfHeight - curComponentHalfHeight,
                    lineShift: top + componentHalfHeight,
                }, {
                    isNearly: isNearly(curComponentStyle.top, bottom),
                    lineNode: lineRefs[2], // xb
                    line: 'xb',
                    dragShift: bottom,
                    lineShift: bottom,
                },
                {
                    isNearly: isNearly(curComponentStyle.bottom, bottom),
                    lineNode: lineRefs[2], // xb
                    line: 'xb',
                    dragShift: bottom - curComponentStyle.height,
                    lineShift: bottom,
                },
            ],
            left: [
                {
                    isNearly: isNearly(curComponentStyle.left, left),
                    lineNode: lineRefs[3], // yl
                    line: 'yl',
                    dragShift: left,
                    lineShift: left,
                },
                {
                    isNearly: isNearly(curComponentStyle.right, left),
                    lineNode: lineRefs[3], // yl
                    line: 'yl',
                    dragShift: left - curComponentStyle.width,
                    lineShift: left,
                },
                {
                    // 组件与拖拽节点的中间是否对齐
                    isNearly: isNearly(curComponentStyle.left + curComponentHalfwidth, left + componentHalfwidth),
                    lineNode: lineRefs[4], // yc
                    line: 'yc',
                    dragShift: left + componentHalfwidth - curComponentHalfwidth,
                    lineShift: left + componentHalfwidth,
                },
                {
                    isNearly: isNearly(curComponentStyle.left, right),
                    lineNode: lineRefs[5], // yr
                    line: 'yr',
                    dragShift: right,
                    lineShift: right,
                },
                {
                    isNearly: isNearly(curComponentStyle.right, right),
                    lineNode: lineRefs[5], // yr
                    line: 'yr',
                    dragShift: right - curComponentStyle.width,
                    lineShift: right,
                },
            ]
        }

        const needToShow = []
        const { rotate } = coreStore.curComponent.style;
        Object.keys(conditions).forEach(key => {
            // 遍历符合的条件并处理
            conditions[key].forEach((condition) => {
                if (!condition.isNearly) return
                // 修改当前组件位移,自动吸附
                coreStore.setShapeSingleStyle({
                    key,
                    value: rotate != 0 ? translatecurComponentShift(key, condition, curComponentStyle) : condition.dragShift,
                })
                condition.lineNode.style[key] = `${condition.lineShift}px`
                needToShow.push(condition.line)
            })
        })

        // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
        // 同一方向上的线只显示一条，例如多条横条只显示一条横线
        if (needToShow.length) {
            chooseTheTureLine(needToShow, isDownward, isRightward)
        }
    })
}
function hideLine() {
    Object.keys(lineStatus).forEach(line => {
        lineStatus[line] = false
    })
}
function translatecurComponentShift(key, condition, curComponentStyle) {
    const { width, height } = coreStore.curComponent.style;
    if (key == 'top') {
        return Math.round(condition.dragShift - (height - curComponentStyle.height) / 2)
    }
    return Math.round(condition.dragShift - (width - curComponentStyle.width) / 2)
}
function chooseTheTureLine(needToShow, isDownward, isRightward) {
    // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
    if (isRightward) {
        if (needToShow.includes('yr')) {
            lineStatus.yr = true
        } else if (needToShow.includes('yc')) {
            lineStatus.yc = true
        } else if (needToShow.includes('yl')) {
            lineStatus.yl = true
        }
    } else {
        if (needToShow.includes('yl')) {
            lineStatus.yl = true
        } else if (needToShow.includes('yc')) {
            lineStatus.yc = true
        } else if (needToShow.includes('yr')) {
            lineStatus.yr = true
        }
    }

    if (isDownward) {
        if (needToShow.includes('xb')) {
            lineStatus.xb = true
        } else if (needToShow.includes('xc')) {
            lineStatus.xc = true
        } else if (needToShow.includes('xt')) {
            lineStatus.xt = true
        }

    } else {
        if (needToShow.includes('xt')) {
            lineStatus.xt = true
        } else if (needToShow.includes('xc')) {
            lineStatus.xc = true
        } else if (needToShow.includes('xb')) {
            lineStatus.xb = true
        }
    }
}
function isNearly(dragValue, targetValue) {
    return Math.abs(dragValue - targetValue) <= diff.value
}
onMounted(() => {
    eventBus.on('move', (isDownward, isRightward) => {
        showLine(isDownward, isRightward)
    })
    eventBus.on('unmove', () => {
        hideLine()
    })
})
</script>

<template>
    <div class="mark-line">
        <div v-for="(line, index) in lines" v-show="lineStatus[line] || false" :key="line"
            :ref="(el) => lineRefs[index] = el" class="line" :class="line.includes('x') ? 'xline' : 'yline'"></div>
    </div>
</template>


<style lang="less" scoped>
.mark-line {
    height: 100%;
}

.line {
    background: #59c7f9;
    position: absolute;
    z-index: 1000;
}

.xline {
    width: 100%;
    height: 1px;
}

.yline {
    width: 1px;
    height: 100%;
}
</style>
