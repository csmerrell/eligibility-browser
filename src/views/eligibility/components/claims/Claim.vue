<script setup lang="ts">
//util
import { formatDate } from '@/util/dates/formatDate'

//types
import type { RenderedClaim } from '../../model/Event'
const props = defineProps<RenderedClaim>()
const { desc, claim } = props

const formattedDate = formatDate(props.claim.claim_date)
</script>

<template>
  <div class="claim">
    <a href="#" :title="desc">{{ formattedDate }}</a>
    <span>{{ `$${claim.claim_amount}` }}</span>
  </div>
</template>

<style scoped lang="scss">
.claim {
  padding: 0.25em 1em;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
