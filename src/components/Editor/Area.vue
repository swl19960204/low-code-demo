<script setup>
defineProps({
    start: {
        type: Object,
        default: () => ({}),
    },
    width: {
        type: Number,
        default: 0,
    },
    height: {
        type: Number,
        default: 0,
    },
})
</script>

<template>
    <div :style="{
        left: start.x + 'px',
        top: start.y + 'px',
        width: width + 'px',
        height: height + 'px',
    }" class="area"></div>
</template>


<style lang="less" scoped>
.area {
    border: 1px solid #70c0ff;
    position: absolute;
}
</style>
