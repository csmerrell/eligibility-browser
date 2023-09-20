<script setup lang="ts">
//vue
import { onMounted, ref } from 'vue'

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
const el = ref<HTMLDivElement | null>(null)

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

const setRightPaneVisibility = (val: boolean) => {
  if (rightPaneRef.value) {
    rightPaneRef.value.expanded = val

    if (props.singleSidePane && leftPaneRef.value?.expanded) {
      leftPaneRef.value?.toggle()
    }
  }
}

defineExpose({
  toggleLeftPane,
  toggleRightPane,
  setRightPaneVisibility
})

const emit = defineEmits(['toggleStarted', 'toggleComplete'])

onMounted(() => {
  if (props.leftPaneConfig.width) {
    el.value?.style.setProperty('--fh-left-pane-width', props.leftPaneConfig.width)
  }
  if (props.rightPaneConfig.width) {
    el.value?.style.setProperty('--fh-right-pane-width', props.rightPaneConfig.width)
  }
})
</script>

<script lang="ts">
//defaults
const sidePaneDefaults = () => {
  return { initExpanded: false, width: '40rem' }
}
</script>

<template>
  <div ref="el" class="flex-hud">
    <Header>
      <slot name="header" />
    </Header>
    <BoxRebaser>
      <div class="hud-body">
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
</template>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
}
.flex-hud {
  --fh-bg: #fff;
  --fh-secondary: #666;

  height: 100vh;
  width: 100vw;

  display: flex;
  flex-flow: column;

  .hud-body {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-flow: row;

    #main-panel {
      flex-grow: 1;
      flex-basis: calc(100% - var(--fh-left-pane-width) - var(--fh-right-pane-width));
    }
    #main-panel,
    .left-pane,
    .right-pane {
      overflow-y: auto;
    }
  }
}
</style>
