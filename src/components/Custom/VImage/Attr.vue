<script setup>
import { computed } from 'vue'
import CommonAttr from '../../Common/CommonAttr.vue'
import { useCoreStore } from '@/stores/core'
const coreStore = useCoreStore();
</script>

<template>
    <div class="attr-list">
        <CommonAttr />
        <a-form layout="vertical">
            <a-form-item label="镜像翻转">
                <a-checkbox v-model:checked="coreStore.curComponent.propValue.flip.horizontal"
                    label="horizontal">水平翻转</a-checkbox>
                <a-checkbox v-model:checked="coreStore.curComponent.propValue.flip.vertical"
                    label="vertical">垂直翻转</a-checkbox>
            </a-form-item>
        </a-form>
    </div>
</template>