<script setup>
import { useSnapshotStore } from '@/stores/snapshot'
import { useCoreStore } from '../stores/core'
import { useLockStore } from '../stores/lock'
// import { ref } from "vue";

// const isShowPreview = ref(false);
const snapshotStore = useSnapshotStore();
const coreStore = useCoreStore();
const lockStore = useLockStore();
function onExportJSON() {
}

function undo() {
    snapshotStore.undo();
}

function redo() {
    snapshotStore.redo();
}

function handleFileChange() {
}

function preview() {
}

function save() {
}

function clearCanvas() {
    coreStore.setCurComponent({ component: null, index: -1 });
    coreStore.setComponentData([]);
    snapshotStore.recordSnapshot();
}

function onAceEditorChange() {
}

function onImportJSON() {
}
function lock() {
    lockStore.lock();
}
function unlock() {
    lockStore.unlock();
}
</script>

<template>
    <div class="toolbar">
        <a-button @click="onAceEditorChange">JSON</a-button>
        <a-button @click="onImportJSON">导入</a-button>
        <a-button @click="onExportJSON">导出</a-button>
        <a-button @click="undo" :disabled="snapshotStore.snapshotIndex <= 0">撤消</a-button>
        <a-button @click="redo"
            :disabled="snapshotStore.snapshotIndex === snapshotStore.snapshotData.length - 1">重做</a-button>
        <label for="input" class="insert">
            插入图片
            <input id="input" type="file" hidden @change="handleFileChange" />
        </label>

        <a-button @click="preview(false)">预览</a-button>
        <a-button @click="save">保存</a-button>
        <a-button @click="clearCanvas">清空画布</a-button>
        <a-button>组合</a-button>
        <a-button>拆分</a-button>
        <a-button :disabled="!coreStore.curComponent || coreStore.curComponent.isLock" @click="lock">锁定</a-button>
        <a-button :disabled="!coreStore.curComponent || !coreStore.curComponent.isLock" @click="unlock">解锁</a-button>
    </div>
</template>

<style lang="less" scoped>
.toolbar {
    padding: 15px 10px;
    white-space: nowrap;
    overflow-x: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 10px;
    background: #fff;
    border-color: #e4e7ed;
    border-bottom: 1px solid #dcdfe6;
    // background: var(--main-bg-color);
    // border-color: var(--ace-bg-color);
    // border-bottom: 1px solid var(--border-color);
}

.insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid var(--toolbar-border-color);
    color: var(--text-color);
    appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
}
</style>
