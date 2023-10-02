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
import { getClaimants, getParsedClaimants } from './data/parseClaimants'

//model
import { Claimant, type RawClaimant } from './model/Claimant'

const batchParseClaimants = (rawClaimants: RawClaimant[]) => {
  const slice = rawClaimants.splice(0, 50)
  slice.forEach((rawClaimant) => store.claimants.push(new Claimant(rawClaimant)))

  if (rawClaimants.length > 0) {
    setTimeout(() => batchParseClaimants(rawClaimants), 0)
  }
}

//observables
getClaimants().then((rawClaimants: RawClaimant[]) => batchParseClaimants(rawClaimants))

// getParsedClaimants().then((parsedClaimants) => (store.claimants = parsedClaimants))
</script>

<template>
  <div class="eligibility-dashboard">
    <teleport to="#main-left-pane">
      <ClaimantList v-if="store.claimants.length > 0" />
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
