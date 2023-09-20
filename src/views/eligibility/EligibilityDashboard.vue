<script setup lang="ts">
//vue
import { ref } from 'vue'

//store
import { useEligibilityStore } from '@/stores/eligibility'
const store = useEligibilityStore()

//components
import ClaimantList from './components/people/ClaimantList.vue'
import ClaimantHistory from './components/history/ClaimantHistory.vue'
import ClaimsDetail from './components/claims/ClaimsDetail.vue'

//data
import { getParsedClaimants } from './data/parseClaimants'

//model
import type { Claimant } from './model/Claimant'

//observables
const claimants = ref<Claimant[] | null>(null)

getParsedClaimants().then((parsedClaimants) => {
  claimants.value = parsedClaimants
})
</script>

<template>
  <div class="eligibility-dashboard">
    <teleport to="#main-left-pane">
      <ClaimantList v-if="claimants" :claimants="claimants" />
    </teleport>
    <ClaimantHistory v-if="store.selectedClaimant" />
    <div v-else class="placeholder">
      Select an individual from the left to view their eligibility and claims history.
    </div>
    <teleport to="#main-right-pane">
      <ClaimsDetail />
    </teleport>
  </div>
</template>

<style lang="scss">
.eligibility-dashboard {
  position: relative;
  height: 100%;
  .placeholder {
    font-size: 1.5em;
    text-align: center;
    padding: 2rem 12%;
    color: var(--clr-secondary);
  }
}
</style>
