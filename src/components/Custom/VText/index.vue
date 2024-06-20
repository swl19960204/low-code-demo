<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useCoreStore } from "@/stores/core"
import { keyCodes } from '@/utils/shortcutKey'
import eventBus from '@/utils/eventBus'
const props = defineProps({
    prototies: {
        type: String,
        required: true,
        default: '',
    },
    element: {
        type: Object,
        default: () => { },
    },
    linkage: {
        type: Object,
        default: () => { },
    },
})
const emit = defineEmits(['onInput'])
const coreStore = useCoreStore()
const canEdit = ref(false)
const textEditRef = ref(null)
const isCtrlDown = ref(false)
const selectText = (element) => {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
}
const setEdit = () => {
    if (props.element.isLock) return
    canEdit.value = true;
    selectText(textEditRef.value)
}
const handlePaste = (e) => {
    e.preventDefault()
    const clp = e.clipboardData
    const text = clp.getData('text/plain') || ''
    if (text !== '') {
        document.execCommand('insertText', false, text)
    }
    emit('onInput', textEditRef.value, e.target.innerHTML)
}
const handleMousedown = (e) => {
    if (canEdit.value) {
        e.stopPropagation()
    }
}
const handleBlur = (e) => {
    const html = e.target.innerHTML;
    if (html !== '') {
        // props.element.propValue = html
        // coreStore.curComponent.propValue = html
    } else {
        // props.element.propValue = ""
        // coreStore.curComponent.propValue = ""
    }
    canEdit.value = false;
}
const handleInput = (e) => {
    emit('onInput', textEditRef.value, e.target.innerHTML)
}
const handleKeydown = (e) => {
    // 阻止冒泡，防止触发复制、粘贴组件操作
    canEdit.value && e.stopPropagation()
    if (e.keyCode == 17) {
        isCtrlDown.value = true
    } else if (isCtrlDown.value && canEdit.value && keyCodes.includes(e.keyCode)) {
        e.stopPropagation()
    } else if (e.keyCode == 46) { // deleteKey
        e.stopPropagation()
    }
}
const handleKeyup = (e) => {
    // 阻止冒泡，防止触发复制、粘贴组件操作
    canEdit.value && e.stopPropagation()
    if (e.keyCode == 17) {
        isCtrlDown.value = false
    }
}
function handleComponentClick() {
    // 如果当前点击的组件 id 和 VText 不是同一个，需要设为不允许编辑
    if (coreStore.curComponent.id !== props.element.id) {
        canEdit.value = false
    }
}
onMounted(() => {
    eventBus.on('componentClick', handleComponentClick)
});

onBeforeUnmount(() => {
    eventBus.off('componentClick', handleComponentClick)
});
</script>

<template>
    <div class="v-text" v-if="coreStore.editMode === 'edit'" @keydown="handleKeydown" @keyup="handleKeyup">
        <div ref="textEditRef" :contenteditable="canEdit" :class="{ 'can-edit': canEdit }" tabindex="0"
            :style="{ verticalAlign: element.style.verticalAlign, padding: element.style.padding + 'px' }"
            @dblclick="setEdit" @paste="handlePaste" @mousedown="handleMousedown" @blur="handleBlur"
            @input="handleInput" v-html="element.propValue"></div>
    </div>
    <div v-else class="v-text preview">
        <div :style="{ verticalAlign: element.style.verticalAlign, padding: element.style.padding + 'px' }"
            v-html="element.propValue"></div>
    </div>
</template>


<style lang="less" scoped>
.v-text {
    width: 100%;
    height: 100%;
    display: table;

    div {
        display: table-cell;
        width: 100%;
        height: 100%;
        outline: none;
        word-break: break-all;
        padding: 4px;
    }

    .can-edit {
        cursor: text;
        height: 100%;
    }
}

.preview {
    user-select: none;
}
</style>
