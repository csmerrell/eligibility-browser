<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import PanelHeader from '../PanelHeader.vue'
import ClaimantItem from './Claimant.vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useEligibilityStore } from '@/stores/eligibility'

const store = useEligibilityStore()
const scroller = ref<any | null>(null)
const scrollWrapper = ref<HTMLElement | null>(null)

const itemHeight = 52
const bufferSize = 20

let lastScroll = Date.now()
let scrollerIndex = 0 // Track the current scroll position

const debouncedScrollHandler = () => {
  if (Date.now() - lastScroll > 50) {
    resizeScroller()
  }
  lastScroll = Date.now()
  // Update the scrollerIndex based on the scroll position
  scrollerIndex = Math.floor(scroller.value.scrollTop / itemHeight)
}

const resizeScroller = () => {
  if (!(scroller.value && scrollWrapper.value)) return

  scroller.value.$el.style.setProperty('height', `${scrollWrapper.value.clientHeight}px`)
}

watch(() => scroller.value, resizeScroller)

window.addEventListener('resize', debouncedScrollHandler)

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedScrollHandler)
})
</script>

<template>
  <div class="claimant-list">
    <PanelHeader>People</PanelHeader>
    <div ref="scrollWrapper" class="scroll-wrapper">
      <RecycleScroller
        ref="scroller"
        class="recycle-scroller"
        :items="store.claimants"
        :item-size="itemHeight"
        :key-field="'id'"
        :min-index="Math.max(0, scrollerIndex - bufferSize)"
        :max-index="Math.min(store.claimants.length - 1, scrollerIndex + bufferSize)"
        v-slot="{ item }"
      >
        <ClaimantItem v-bind="item" />
      </RecycleScroller>
      <!-- <div v-for="claimant in store.claimants" :key="claimant.id">
        <ClaimantItem v-bind="claimant" />
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.claimant-list {
  height: 100%;
  display: flex;
  flex-flow: column;

  .scroll-wrapper {
    flex-grow: 1;
    display: flex;
    .recycle-scroller {
      flex-grow: 1;
    }
  }
}
</style>
