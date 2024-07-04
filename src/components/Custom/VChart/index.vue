<script setup>
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ScatterChart, BarChart, LineChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components';

use([
    CanvasRenderer,
    ScatterChart,
    BarChart,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);

defineProps({
    prototies: {
        type: Object,
        require: true,
        default: () => { },
    },
    element: {
        type: Object,
        default: () => { },
    },
})

</script>

<template>
    <v-chart class="chart" :option="prototies.option" autoresize />
</template>
<style lang="less" scoped>
.chart {
    height: 400px;
}
</style>