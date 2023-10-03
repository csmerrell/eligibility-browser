<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { FlexHud, useFlexHudStore, type FlexHudProps, type SidePaneProps } from 'flex-hud'
import Header from '@/components/localHud/Header.vue'
import { RouterView } from 'vue-router'
import { useEligibilityStore } from './stores/eligibility'

const store = useEligibilityStore()
const hudStore = useFlexHudStore()
hudStore.initState(config)

//Watch selected claimant changes
watch(
  () => store.selectedClaimant,
  (next, prev) => {
    if (next) {
      resize()
    } else {
      hudStore.expandLeftPane()
      hudStore.collapseRightPane()
    }
  }
)

//Watch window resize hud state changes.
const goCompact = () => {
  if (store.focusPane === 'main') {
    hudStore.collapseLeftPane()
    hudStore.collapseRightPane()
  } else {
    hudStore.expandLeftPane()
  }
}

const goMidWidth = () => {
  if (store.focusPane === 'main') {
    hudStore.collapseLeftPane()
    hudStore.expandRightPane()
  } else {
    hudStore.expandLeftPane()
  }
}

const goFull = () => {
  hudStore.expandLeftPane()

  if (store.focusPane === 'main') {
    hudStore.expandRightPane()
  }
}

let lastCheck = 0
const compactCheckDebounce = 50
const resize = () => {
  if (window.innerWidth < compactBreakpoint) {
    goCompact()
  } else if (window.innerWidth < midWidthBreakpoint) {
    goMidWidth()
  } else {
    goFull()
  }
}
const debouncedResize = () => {
  lastCheck = Date.now()
  setTimeout(() => {
    if (Date.now() - lastCheck < compactCheckDebounce) return
    resize()
  }, compactCheckDebounce)
}
window.addEventListener('resize', debouncedResize)

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize)
  hudStore.$reset()
  store.$reset()
})

const hud = ref<typeof FlexHud | null>(null)
</script>

<script lang="ts">
const compactBreakpoint = 800
const midWidthBreakpoint = 1200

const leftPaneConfig: SidePaneProps = {
  initExpanded: true,
  width: '27rem'
}

const rightPaneConfig: SidePaneProps = {
  initExpanded: false,
  width: '18rem'
}

const config: FlexHudProps = {
  leftPaneConfig,
  rightPaneConfig,
  singleSidePane: false,
  compactBreakpoint
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
      <RouterView v-if="hud" />
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
    overflow-x: hidden;
  }

  &.flex-hud {
    --fh-secondary: var(--clr-pale-gray);
  }
}
</style>
