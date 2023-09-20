<script setup lang="ts">
//vue
import { ref } from 'vue'

//Components
import { BoxRebaser } from 'coordinate-rebaser'
import Header from './components/Header.vue'
import LeftPane from './components/LeftPane.vue'
import RightPane from './components/RightPane.vue'

//types
import type { FlexHudProps } from './model/FlexHud'
import SafariPadding from './components/SafariPadding.vue'
const props = withDefaults(defineProps<FlexHudProps>(), {
  leftPaneConfig: sidePaneDefaults,
  rightPaneConfig: sidePaneDefaults,
  singleSidePane: true
})

const rightPaneRef = ref<typeof RightPane | null>(null)
const leftPaneRef = ref<typeof LeftPane | null>(null)

const toggleLeftPane = () => {
  leftPaneRef.value?.toggle()
  if (props.singleSidePane && rightPaneRef.value?.expanded) {
    rightPaneRef.value?.toggle()
  }
}
const toggleRightPane = () => {
  rightPaneRef.value?.toggle()
  if (props.singleSidePane && leftPaneRef.value?.expanded) {
    leftPaneRef.value?.toggle()
  }
}

defineExpose({
  toggleLeftPane,
  toggleRightPane
})

const emit = defineEmits(['toggleStarted', 'toggleComplete'])
</script>

<script lang="ts">
//defaults
const sidePaneDefaults = () => {
  return { initExpanded: false, width: '40rem' }
}
</script>

<template>
  <div class="flex-hud">
    <Header>
      <slot name="header" />
    </Header>
    <div class="hud-body">
      <BoxRebaser class="hud-body">
        <div class="body-contents">
          <LeftPane
            v-if="$slots['left-pane']"
            ref="leftPaneRef"
            v-bind="props.leftPaneConfig"
            @toggle-available="emit('toggleComplete', leftPaneRef!.collapsed)"
            @toggled="emit('toggleStarted', leftPaneRef!.collapsed)"
          >
            <slot name="left-pane" />
            <SafariPadding />
          </LeftPane>
          <div v-if="$slots['main-pane']" id="main-panel">
            <slot name="main-pane" />
            <SafariPadding />
          </div>
          <div v-else id="main-panel">
            <slot />
            <SafariPadding />
          </div>
          <RightPane
            v-if="$slots['right-pane']"
            ref="rightPaneRef"
            v-bind="props.rightPaneConfig"
            @toggle-available="emit('toggleComplete', rightPaneRef!.collapsed)"
            @toggled="emit('toggleStarted', rightPaneRef!.collapsed)"
          >
            <slot name="right-pane" />
            <SafariPadding />
          </RightPane>
        </div>
      </BoxRebaser>
    </div>
  </div>
</template>

<style lang="scss">
.flex-hud {
  --fh-bg: #fff;
  --fh-secondary: #666;

  height: 100vh;
  width: 100vw;

  display: flex;
  flex-flow: column;

  .hud-body {
    flex-grow: 1;
    .body-contents {
      height: 100%;
      width: 100%;
      display: flex;
      flex-flow: row;
      #main-panel {
        flex-grow: 1;
      }
      #main-panel,
      .left-pane,
      .right-pane {
        overflow-y: auto;
      }
    }
  }
}
</style>

<style lang="scss">
body {
  margin: 0;
}
</style>
