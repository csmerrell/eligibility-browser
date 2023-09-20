<script setup lang='ts'>
import { computed } from 'vue';
import { Claimant, type ClaimantProps } from '@/views/eligibility/model/Claimant';
import { useEligibilityStore } from "@/stores/eligibility";
const store = useEligibilityStore();

const props = defineProps<ClaimantProps>();
const fullName = computed(() => {
  return `${props.last_name}, ${props.first_name}`
})

const isSelected = computed(() => {
  return props.uniqueId === store.selectedClaimant?.uniqueId
})
</script>

<template>
  <div class='claimant' :class="{selected: isSelected}" @click="store.timelineAnimating ? null : store.setSelectedClaimant(props)">
    <span class="name">{{ fullName }}</span>
    <span class="status">({{ props.status }})</span>
    <span v-if="isSelected" class="indicator">▶</span>
  </div>
</template>

<style scoped lang='scss'>
.claimant {
  padding: 1rem;
  border-bottom: 1px solid var(--clr-border);
  cursor: pointer;

  display: flex;
  flex-flow: row;
  justify-content: flex-start;

  .status {
    padding-left: .5em;
    font-size: .9em;
    color: var(--clr-secondary);
    font-style: italic;
    flex-grow: 1;
  }

  .indicator {
    justify-self: flex-end;
  }

  
  &:hover {
    background-color: var(--clr-pale-gray)
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