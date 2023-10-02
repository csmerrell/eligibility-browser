<script setup lang="ts">
import { useEligibilityStore } from '@/stores/eligibility'

import Event from './Event.vue'

const store = useEligibilityStore()
</script>

<template>
  <div class="events">
    <Event
      v-for="(event, idx) in store.renderedEvents"
      :key="`${idx}-${event.desc}-${event.date}`"
      v-bind="event"
    />
  </div>
</template>

<style scoped lang="scss">
.events {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
