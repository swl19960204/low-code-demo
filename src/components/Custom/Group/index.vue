<script setup>
defineProps({
    prototies: {
        type: Array,
        default: () => [],
    },
    element: {
        type: Object,
        default: () => { },
    },
})
</script>

<template>
    <div class="group">
        <div>
            <component :is="item.component" v-for="item in prototies" :id="`component-${item.id}`" :key="item.id"
                class="component" :style="item.groupStyle" :prototies="item.propValue" :element="item"
                :request="item.request" />
        </div>
    </div>
</template>


<style lang="less" scoped>
.group {
    &>div {
        position: relative;
        width: 100%;
        height: 100%;

        .component {
            position: absolute;
        }
    }
}
</style>
