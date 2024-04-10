<script setup>

const handleDragStart = () => {

}

</script>


<template>
    <div class="optional-component-list" @dragstart="handleDragStart">
        <!-- <div v-for="(item, index) in componentList" :key="index" class="optional-component-list_item" draggable
            :data-index="index">
            <span v-if="item.icon.substr(0, 2) === 'el'" :class="item.icon"></span>
            <span v-else class="iconfont" :class="'icon-' + item.icon"></span>
        </div> -->
    </div>
</template>


<style lang="less" scoped>
.optional-component-list {
    opacity: 1;
    height: 65%;
    padding: 8px;
    display: grid;
    position: relative;
    grid-gap: 10px 19px;
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 40px);
    transition: opacity .5s .5s;

    &_item {
        width: 80px;
        height: 40px;
        border: 1px solid #ddd;
        cursor: grab;
        text-align: center;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>