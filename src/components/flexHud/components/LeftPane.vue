<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { SidePaneProps } from '../model/FlexHud'
import useSidePane from '../use/useSidePane'

//emits
const emit = defineEmits(['toggled', 'toggleAvailable'])

//props
const props = withDefaults(defineProps<SidePaneProps>(), {
  initExpanded: false
})

//hook
const { expanded, toggling, contentEl, toggle } = useSidePane(props, emit)

//public
defineExpose({
  expanded,
  toggle
})

//mounted
const el = ref<HTMLElement | null>(null)
onMounted(() => {
  if (props.transitionDelay) {
    el.value?.style.setProperty('--fh-width-transition', props.transitionDelay)
  }
})
</script>

<template>
  <div
    ref="el"
    :class="{ collapsed: !expanded, expanded: expanded, toggling: toggling }"
    class="left-pane"
  >
    <div ref="contentEl" class="pane-contents">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-pane {
  --fh-width-transition: 0.5s;
  position: relative;
  transition:
    width var(--fh-width-transition) ease-out,
    flex-basis var(--fh-width-transition) ease-out;

  .pane-contents {
    white-space: nowrap;
    height: 100%;
    width: 100%;
  }

  &.collapsed {
    width: 0;
    flex-basis: 0;
    .pane-contents {
      overflow: hidden;
    }
  }

  &.expanded {
    flex-basis: var(--fh-left-pane-width);
    width: var(--fh-left-pane-width);
  }

  &.expanded,
  &.toggling {
    border-right: 1px solid var(--fh-secondary);
    box-shadow: 0 0 5px 0.5px var(--fh-secondary);
  }
}
</style>
