<script setup lang="ts">
/**
 * An applet stub component to test the flex-hud component(s)
 */
import { ref, watch } from 'vue'
import FlexHud from '@/components/flexHud/FlexHud.vue'
import Header from '@/components/localHud/Header.vue'
import type { FlexHudProps } from './components/flexHud/model/FlexHud'
import { RouterView } from 'vue-router'

import { useEligibilityStore } from './stores/eligibility'
const store = useEligibilityStore()

const hud = ref<typeof FlexHud | null>(null)

watch(hud, () => {
  if (hud.value) {
    store.setRightPaneVisiblity = hud.value.setRightPaneVisibility
  }
})
</script>

<script lang="ts">
const leftPaneConfig = {
  initExpanded: true,
  width: '23rem'
}

const rightPaneConfig = {
  initExpanded: false,
  width: '18rem'
}
const config: FlexHudProps = {
  leftPaneConfig,
  rightPaneConfig,
  singleSidePane: false
}
</script>

<template>
  <FlexHud ref="hud" class="app" v-bind="config">
    <template #header>
      <Header />
    </template>
    <template #left-pane>
      <div id="main-left-pane" />
    </template>
    <template #main-pane>
      <RouterView />
    </template>
    <template #right-pane>
      <div id="main-right-pane" />
    </template>
  </FlexHud>
</template>

<style scoped lang="scss"></style>

<style lang="scss">
@import './styles/index.scss';

.app {
  .main-header,
  .left-pane {
    background-color: var(--clr-bg-off);
  }

  #main-panel {
    overflow: hidden;
    flex-shrink: 1;
  }

  #main-right-pane,
  #main-left-pane {
    height: 100%;
  }

  &.flex-hud {
    --fh-secondary: var(--clr-pale-gray);
  }
}
</style>
