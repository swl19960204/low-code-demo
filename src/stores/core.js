import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', {
  state: () => ({
    // 页面全局数据
    canvasStyleData: {
      width: 1200,
      height: 740,
      scale: 100,
      color: '#000',
      opacity: 1,
      background: '#fff',
      fontSize: 14
    },
    componentData: [], // 画布组件数据
    curComponent: null,
    curComponentIndex: -1,
    clickOutSideComponent: false
  }),
  actions: {
    addComp(component, index) {
      if (index !== undefined) {
        this.componentData.splice(index, 0, component)
      } else {
        this.componentData.push(component)
      }
    },
    deleteComp(index) {
      if (index === undefined) {
        index = this.curComponentIndex
      }

      if (index == this.curComponentIndex) {
        this.curComponentIndex = -1
        this.curComponent = null
      }

      if (/\d/.test(index)) {
        this.componentData.splice(index, 1)
      }
    },
    setCurComponent({ component, index }) {
      this.curComponent = component
      this.curComponentIndex = index
    },
    setComponentData(componentData = []) {
      this.componentData = componentData
    },
    setShapeStyle({ top, left, width, height, rotate }) {
      if (top !== undefined) this.curComponent.style.top = Math.round(top)
      if (left !== undefined) this.curComponent.style.left = Math.round(left)
      if (width) this.curComponent.style.width = Math.round(width)
      if (height) this.curComponent.style.height = Math.round(height)
      if (rotate) this.curComponent.style.rotate = Math.round(rotate)
    },
    setClickOutSideCompStatus(status) {
      this.clickOutSideComponent = status
    },
    setShapeSingleStyle({ key, value }) {
      this.curComponent.style[key] = value
    },
  }
})
