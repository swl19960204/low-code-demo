<script setup>
defineProps({
    prototies: {
        type: String,
        required: true,
        default: '',
    },
    element: {
        type: Object,
        default: () => { },
    },
})
</script>

<template>
    <div class="circle-shape">
        <v-text :prototies="element.propValue" :element="element" />
    </div>
</template>


<style lang="less" scoped>
.circle-shape {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: auto;
}
</style>
