// import store from '@/stores'
import eventBus from './eventBus'

const ctrlKey = 17,
    commandKey = 91, // mac command
    vKey = 86, // 粘贴
    cKey = 67, // 复制
    xKey = 88, // 剪切

    yKey = 89, // 重做
    zKey = 90, // 撤销

    gKey = 71, // 组合
    bKey = 66, // 拆分

    lKey = 76, // 锁定
    uKey = 85, // 解锁

    sKey = 83, // 保存
    pKey = 80, // 预览
    dKey = 68, // 删除
    deleteKey = 46, // 删除
    eKey = 69 // 清空画布

export const keyCodes = [66, 67, 68, 69, 71, 76, 80, 83, 85, 86, 88, 89, 90]

// // 与组件状态无关的操作
// const basemap = {
//     [vKey]: paste,
//     [yKey]: redo,
//     [zKey]: undo,
//     [sKey]: save,
//     [pKey]: preview,
//     [eKey]: clearCanvas,
// }

// // 组件锁定状态下可以执行的操作
// const lockMap = {
//     ...basemap,
//     [uKey]: unlock,
// }

// // 组件未锁定状态下可以执行的操作
// const unlockMap = {
//     ...basemap,
//     [cKey]: copy,
//     [xKey]: cut,
//     [gKey]: compose,
//     [bKey]: decompose,
//     [dKey]: deleteComponent,
//     [deleteKey]: deleteComponent,
//     [lKey]: lock,
// }