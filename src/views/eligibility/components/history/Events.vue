<script setup lang="ts">
//vue
import { computed } from 'vue'

//components
import Event from './Event.vue'

//store
import { useEligibilityStore } from '@/stores/eligibility'
import { useFlexHudStore } from 'flex-hud'
const store = useEligibilityStore()
const hudStore = useFlexHudStore()

const rightPaneCollapsed = computed(() => {
  return !hudStore.rightPaneState.expanded
})

const openClaims = () => {
  if (store.timelineAnimating) return

  hudStore.expandRightPane()
}
</script>

<template>
  <div class="events">
    <Event
      v-for="(event, idx) in store.renderedEvents"
      :key="`${idx}-${event.desc}-${event.date}`"
      v-bind="event"
    />
    <div
      v-if="rightPaneCollapsed && !hudStore.mainPaneToggling"
      class="claim-expander"
      @click="openClaims"
    >
      View Claims ➜
    </div>
  </div>
</template>

<style scoped lang="scss">
.events {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .claim-expander {
    color: var(--clr-dark-purple);
    font-weight: bold;
    cursor: pointer;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    font-size: 0.8em;
  }
}
</style>
