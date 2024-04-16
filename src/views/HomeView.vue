<script setup>
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useCoreStore } from '../stores/core'
import { useSnapshotStore } from '../stores/snapshot'
import { useComposeStore } from '../stores/compose'
import Toobar from '../components/Toobar.vue'
import OptionalComponentList from '../components/OptionalComponentList.vue'
import Editor from '../components/Editor/index.vue'
import componentList from '../components/Custom/component-list'
import { generateID } from '../utils'
import { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'

const isDarkMode = ref(false);
const leftActive = ref(true);
const rightActive = ref(true);
const activeName = ref('attr');
const coreStore = useCoreStore();
const snapShotstore = useSnapshotStore();
const composeStore = useComposeStore();

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  const index = e.dataTransfer.getData('index');
  const rectInfo = composeStore.editor.getBoundingClientRect()
  console.log("🚀 ~ handleDrop ~ e:", e.target)
  console.log("🚀 ~ handleDrop ~ e:", index)
  if (index) {
    const component = cloneDeep(componentList[index])
    component.style.top = e.clientY - rectInfo.y
    component.style.left = e.clientX - rectInfo.x
    component.id = generateID()

    // 根据画面比例修改组件样式比例
    changeComponentSizeWithScale(component)

    coreStore.addComponent(component);
    snapShotstore.recordSnapshot();
  }
}
const handleDragOver = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}
const handleMouseDown = (e) => {
  e.stopPropagation()
  coreStore.setClickOutSideCompStatus(false);
}
const deselectCurComponent = () => {
  if (!coreStore.clickOutSideComponent) {
    coreStore.setCurComponent({ component: null, index: null })
  }
}
</script>

<template>
  <div :class="!isDarkMode ? 'home' : 'home dark'">
    <Toobar />

    <main>
      <section :class="leftActive ? 'left active' : 'left inactive'">
        <OptionalComponentList />
        <!-- <RealTimeComponentList /> -->
      </section>

      <section class="middle">
        <div class="middle-content" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent">
          <Editor />
        </div>
      </section>

      <section :class="rightActive ? 'right active' : 'right inactive'">
        <!-- v-if="curComponent"  -->
        <a-tabs v-model:activeKey="activeName">
          <a-tab-pane tab="属性" key="attr">
            <!-- <component :is="curComponent.component + 'Attr'" /> -->
          </a-tab-pane>
          <a-tab-pane tab="动画" key="animation" style="padding-top: 20px;">
            <!-- <AnimationList /> -->
          </a-tab-pane>
          <a-tab-pane tab="事件" key="events" style="padding-top: 20px;">
            <!-- <EventList /> -->
          </a-tab-pane>
        </a-tabs>
        <!-- <CanvasAttr v-else></CanvasAttr> -->
      </section>
    </main>
  </div>
</template>


<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
  background: var(--main-bg-color);

  main {
    height: calc(100% - 64px);
    position: relative;
    background: var(--secondary-bg-color);


    .left,
    .right {
      position: absolute;
      height: 100%;
      top: 0;
      transition: all .3s;
      background: var(--main-bg-color);
      color: var(--text-color);
    }


    .middle {
      margin: 0 288px 0 200px;
      // background: var(--secondary-bg-color);
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;
      transition: all .3s;

      &-content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }


    .left {
      width: 200px;
      left: 0;

      // .real-time-component-list .list:hover {
      //   color: var(--text-color);
      // }

      // .real-time-component-list .actived.list {
      //   color: var(--actived-text-color);
      //   background-color: var(--actived-bg-color);
      // }

      // .real-time-component-list .list {
      //   color: var(--text-color);
      // }

      // &>div {
      //   overflow: auto;

      //   &:first-child {
      //     border-bottom: 1px solid var(--border-color);
      //   }
      // }
    }

    .right {
      position: absolute;
      height: 100%;
      width: 288px;
      right: 0;
      top: 0;
      transition: all .3s;
      background-color: var(--main-bg-color);
    }
  }
}
</style>
