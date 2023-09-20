<script setup lang="ts">
//vue
import { computed, watch, type CSSProperties } from 'vue'

//component
import PanelHeader from '../PanelHeader.vue'
import Claim from './Claim.vue'

//types
import type { RenderedEvent } from '@/views/eligibility/model/Event'

//store
import { useEligibilityStore } from '@/stores/eligibility'
const store = useEligibilityStore()

const hasClaims = computed(() => store.hasClaims)

watch(hasClaims, () => {
  if (hasClaims.value) {
    store.setRightPaneVisiblity(true)
  }
})

const getStyles = (claim: RenderedEvent): CSSProperties => {
  return {
    top: `${claim.position.y}px`
  }
}
</script>

<template>
  <div class="claims-detail">
    <PanelHeader>Claims</PanelHeader>
    <div class="claims-wrapper">
      <Claim
        v-for="renderedClaim in store.renderedClaims"
        :key="renderedClaim.claim.claim_id"
        class="claim"
        :style="getStyles(renderedClaim)"
        v-bind="renderedClaim"
      />
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
}
</style>
