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
    <div class="rect-shape">
        <v-text :prototies="element.propValue" :element="element" />
    </div>
</template>


<style lang="less" scoped>
.rect-shape {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
