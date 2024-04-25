<script setup>
import { ref, reactive, computed } from 'vue';
import { useCoreStore } from '@/stores/core'
import { styleData, selectKey, optionMap } from '@/utils/attr'
const activeKey = ref([]);
const styleMap = ref(styleData);
const selectKeys = ref(selectKey);
const optionMaps = ref(optionMap);

const coreStore = useCoreStore();

const styleKeys = computed(() => {
    if (coreStore.curComponent) {
        const curComponentStyleKeys = Object.keys(coreStore.curComponent.style)
        return styleMap.value.filter(item => curComponentStyleKeys.includes(item.key))
    }
    return []
})

function isIncludesColor(str) {
    return str.toLowerCase().includes('color')
}
</script>
<template>
    <div class="s-common-attr">
        <a-collapse v-model:activeKey="activeKey" accordion>
            <a-collapse-panel key="style" header="通用样式">
                <a-form layout="vertical">
                    <a-form-item v-for="({ key, label }, index) in styleKeys" :key="index" :label="label">

                        <a-select v-if="selectKeys.includes(key)" v-model:value="coreStore.curComponent.style[key]">
                            <a-select-option v-for="item in optionMaps[key]" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>

                        <a-input v-else v-model:value="coreStore.curComponent.style[key]" type="number" />
                    </a-form-item>
                </a-form>
            </a-collapse-panel>
            <!-- <a-collapse-panel key="2" header="This is panel header 2">
                <p>{{ text }}</p>
            </a-collapse-panel>
            <a-collapse-panel key="3" header="This is panel header 3">
                <p>{{ text }}</p>
            </a-collapse-panel> -->
        </a-collapse>
    </div>
</template>


<style lang="less" scoped></style>
