<script setup>
import CommonAttr from '../../Common/CommonAttr.vue'
import { useCoreStore } from "@/stores/core"
const coreStore = useCoreStore()
</script>

<template>
    <div class="attr-list">
        <CommonAttr />
        <a-form layout="vertical">
            <a-form-item label="内容">
                <a-textarea v-model:value="coreStore.curComponent.propValue" :rows="3" />
            </a-form-item>
        </a-form>
    </div>
</template>
