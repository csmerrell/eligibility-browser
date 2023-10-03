<script setup lang="ts">
import { computed } from 'vue'
import type { ClaimantProps } from '@/views/eligibility/model/Claimant'
import { useEligibilityStore } from '@/stores/eligibility'

const store = useEligibilityStore()
const props = defineProps<ClaimantProps>()

const isSelected = computed(() => props.id === store.selectedClaimant?.id)

const claimantClicked = () => {
  store.timelineAnimating ? null : store.setSelectedClaimant({ ...props })
}
</script>

<template>
  <div class="claimant" :class="{ selected: isSelected }" @click="claimantClicked">
    <span class="name">{{ full_name }}</span>
    <span class="status">({{ status }})</span>
    <span v-if="isSelected" class="indicator">▶</span>
  </div>
</template>

<style scoped lang="scss">
.claimant {
  padding: 1rem;
  border-bottom: 1px solid var(--clr-border);
  cursor: pointer;

  display: flex;
  flex-flow: row;
  justify-content: flex-start;

  .status {
    padding-left: 0.5em;
    font-size: 0.9em;
    color: var(--clr-secondary);
    font-style: italic;
    flex-grow: 1;
  }

  .indicator {
    justify-self: flex-end;
  }

  &:hover {
    background-color: var(--clr-pale-gray);
  }

  &.selected {
    background-color: var(--clr-light-purple);
    &:hover {
      background-color: var(--clr-dark-purple);
      .status {
        color: var(--clr-white);
      }
      color: var(--clr-white);
    }
  }
}
</style>
