<script setup>
import { ref, onMounted, watch } from 'vue';
const props = defineProps({
    prototies: {
        type: Object,
        default: () => { },
    },
    element: {
        type: Object,
        default: () => { },
    },
})
const img = ref(null)
const canvas = ref(null)
const ctx = ref(null)
const isFirst = ref(true)
watch(() => props.element.style.width, () => {
    drawImage()
})
watch(() => props.element.style.height, () => {
    drawImage()
})
watch(() => props.prototies.flip.vertical, () => {
    mirrorFlip()
})
watch(() => props.prototies.flip.horizontal, () => {
    mirrorFlip()
})
function drawImage(params) {
    const { width, height } = props.element.style
    canvas.value.width = width
    canvas.value.height = height
    if (isFirst.value) {
        isFirst.value = false
        img.value = document.createElement('img')
        img.value.src = props.prototies.url
        img.value.onload = () => {
            ctx.value.drawImage(img.value, 0, 0, width, height)
            mirrorFlip()
        }
    } else {
        mirrorFlip()
    }
}
function mirrorFlip() {
    const { vertical, horizontal } = props.prototies.flip
    const { width, height } = props.element.style
    const hvalue = horizontal ? -1 : 1
    const vValue = vertical ? -1 : 1
    const { value: ctxInstance } = ctx;
    // 清除图片
    ctxInstance.clearRect(0, 0, width, height)
    // 平移图片
    ctxInstance.translate(width / 2 - width * hvalue / 2, height / 2 - height * vValue / 2)
    // 对称镜像
    ctxInstance.scale(hvalue, vValue)
    ctxInstance.drawImage(img.value, 0, 0, width, height)
    // 还原坐标点
    ctxInstance.setTransform(1, 0, 0, 1, 0, 0)
}
onMounted(() => {
    ctx.value = canvas.value?.getContext('2d')
    drawImage()
})
</script>

<template>
    <div style="overflow: hidden;">
        <canvas ref="canvas"></canvas>
    </div>
</template>
