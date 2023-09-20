<script setup lang='ts'>
//components
import ClaimantItem from './Claimant.vue';

//model
import { Claimant } from '@/views/eligibility/model/Claimant';
import PanelHeader from '../PanelHeader.vue';

const props = defineProps<{
  claimants: Claimant[]
}>()

const uniqueKey = (c: Claimant) => {
  return `${c.first_name}-${c.last_name}-${c.date_of_birth}` //not actually a unique key, but close
}
</script>

<template>
  <div class="claimant-list">
    <PanelHeader>People</PanelHeader>
    <div v-for="claimant in props.claimants" :key="uniqueKey(claimant)">
      <ClaimantItem v-bind="claimant" />
    </div>
  </div>
</template>

<style scoped lang='scss'>
.claimant-list {
  display: flex;
  flex-flow: column;
}
</style>