<script setup lang="ts">
//store
import { useEligibilityStore } from '@/stores/eligibility'
import { useFlexHudStore } from 'flex-hud'
import { HeightRebaser } from 'coordinate-rebaser'

//components
import Timeline from './Timeline.vue'
import Events from './Events.vue'
import PanelHeader from '../PanelHeader.vue'

const store = useEligibilityStore()
const hudStore = useFlexHudStore()

const unsetClaimant = () => {
  if (store.timelineAnimating) return
  store.setSelectedClaimant(null)
}
</script>

<template>
  <div v-if="store.selectedClaimant && !hudStore.mainPaneToggling" class="claimant-history">
    <PanelHeader>
      <span
        v-if="!hudStore.leftPaneState.expanded && !hudStore.mainPaneToggling"
        class="back-to-claimants"
        @click="unsetClaimant"
        >➜</span
      >
      History
      <span v-if="!hudStore.leftPaneState.expanded" class="claimant-name">
        - {{ store.selectedClaimant.full_name }}
      </span>
    </PanelHeader>
    <HeightRebaser>
      <Timeline v-bind="store.selectedClaimant" class="timeline" />
      <Events />
    </HeightRebaser>
  </div>
</template>

<style scoped lang="scss">
.claimant-history {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: stretch;

  .timeline {
    flex-grow: 1;
  }

  .back-to-claimants {
    position: absolute;
    left: 0.5rem;
    transform: scaleX(-1) translateY(-25%);
    font-size: 1.5rem;
    display: inline-block;

    cursor: pointer;

    &:hover {
      color: var(--clr-mid-gray);
    }
  }
}
</style>
