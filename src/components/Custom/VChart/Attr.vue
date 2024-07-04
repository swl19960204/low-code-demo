<script setup>
import CommonAttr from '../../Common/CommonAttr.vue'
import { ref, computed } from 'vue';
import { useCoreStore } from '@/stores/core'
const coreStore = useCoreStore();
const chartType = ref([{
    value: 'bar',
    label: '柱状图',
},
{
    value: 'scatter',
    label: '散点图',
},
{
    value: 'line',
    label: '折线图',
}])

const option = computed(() => {
    return coreStore.curComponent.propValue.option
})
</script>

<template>
    <div class="attr-list">
        <CommonAttr />
        <a-form layout="vertical">
            <a-form-item label="标题">
                <a-switch v-model:checked="option.title.show" checked-children="显示" un-checked-children="隐藏" />
                <a-input v-model:value="option.title.text" placeholder="请输入内容" />
            </a-form-item>
            <a-form-item label="工具提示">
                <a-switch v-model:checked="option.tooltip.show" checked-children="显示" un-checked-children="隐藏" />
            </a-form-item>
            <a-form-item label="图例">
                <a-switch v-model:checked="option.legend.show" checked-children="显示" un-checked-children="隐藏" />
            </a-form-item>
            <a-form-item label="横坐标">
                <a-switch v-model:checked="option.xAxis.show" checked-children="显示" un-checked-children="隐藏" />
            </a-form-item>
            <a-form-item label="图表类型">
                <a-select v-model:value="option.series.type" style="width: 100%" :options="chartType" />
            </a-form-item>
        </a-form>
    </div>
</template>