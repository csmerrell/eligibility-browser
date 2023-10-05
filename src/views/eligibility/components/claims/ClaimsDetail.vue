<script setup lang="ts">
//vue
import { computed, watch, type CSSProperties } from 'vue'

//component
import PanelHeader from '../PanelHeader.vue'
import Claim from './Claim.vue'
import { BoxRebaser, HeightRebaser } from 'coordinate-rebaser'

//types
import type { RenderedEvent } from '@/views/eligibility/model/Event'

//store
import { useEligibilityStore } from '@/stores/eligibility'
import { useFlexHudStore } from 'flex-hud'
const store = useEligibilityStore()
const hudStore = useFlexHudStore()

const hasClaims = computed(() => store.hasClaims)

watch(hasClaims, () => {
  if (hasClaims.value && !hudStore.isCompact) {
    hudStore.expandRightPane()
  }
})

const getStyles = (claim: RenderedEvent): CSSProperties => {
  return {
    top: `${claim.position.y}px`
  }
}

const openTimeline = () => {
  if (store.timelineAnimating) return

  hudStore.collapseRightPane()
}
</script>

<template>
  <div v-if="!hudStore.mainPaneToggling" class="claims-detail">
    <PanelHeader>Claims</PanelHeader>
    <div class="claims-wrapper">
      <BoxRebaser>
        <div
          v-if="hudStore.isCompact && !hudStore.mainPaneToggling"
          class="claims-collapse"
          @click="openTimeline"
        >
          <span class="invert-arrow">➜</span>View Timeline
        </div>
        <div>
          <Claim
            v-for="renderedClaim in store.renderedClaims"
            :key="renderedClaim.claim.claim_id"
            class="claim"
            :style="getStyles(renderedClaim)"
            v-bind="renderedClaim"
          />
        </div>
      </BoxRebaser>
    </div>
    <div class="claims-total">Total Claims: ${{ store.selectedClaimant?.totalClaimAmount }}</div>
  </div>
</template>

<style scoped lang="scss">
.claims-detail {
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow: hidden;

  .claims-wrapper {
    flex-grow: 1;

    .claim {
      position: absolute;
      font-size: 0.9em;
      line-height: 0.9em;
      transform: translateY(-50%);
    }
  }
  .claims-total {
    justify-self: flex-end;
    padding: 1rem;
    border: 1px solid var(--clr-dark-gray);
    background-color: var(--clr-dark-purple);
    color: var(--clr-white);
    text-align: center;
  }

  .claims-collapse {
    color: var(--clr-dark-purple);
    font-weight: bold;
    cursor: pointer;
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
    font-size: 0.8em;

    .invert-arrow {
      transform: scaleX(-1);
      display: inline-block;
      margin-right: 0.25rem;
    }
  }
}

@media screen and (max-width: 600px) {
  .claims-detail {
    font-size: 0.85em;
  }
}
</style>
