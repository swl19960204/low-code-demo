<script setup>
defineProps({
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
})
function selectCurComponent() {

}
function handleMouseDownOnShape() {

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
