<script setup lang='ts'>
//vue
import { computed, onMounted, ref } from 'vue';

//util
import { formatDate } from "@/util/dates/formatDate";

//types
import type { RenderedEvent } from '@/views/eligibility/model/Event';

const props = defineProps<RenderedEvent>()
const el = ref<HTMLDivElement | null>(null)
const lineEl = ref<HTMLDivElement | null>(null)

onMounted(() => {
  setTimeout(() => {
    if(!el.value || !lineEl.value) return
    el.value.style.setProperty('top', `${props.position.y}px`)
    el.value.style.setProperty('left', `${props.position.x}px`)
    el.value.style.setProperty('opacity', '1')
    lineEl.value.style.setProperty('width', props.length)
  }, 100)
})

const isClaim = computed(() => {
  return props.type === "claim"
})

</script>

<template>
  <div ref='el' class='event' :class="{claim: isClaim}">
    <div class='event-contents'>
      <div ref='lineEl' class="line"></div>
      <div class='description' v-if="!isClaim">{{ props.desc }}</div>
      <div class="date" v-if="!isClaim">{{ formatDate(props.date) }}</div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.event {
  position: absolute;
  opacity: 0;
  left: 0;
  right: 0;
  transition: opacity .3s ease-in;

  .line {
    border-top: 1px solid var(--clr-mid-gray);
  }
  .event-contents {
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: .5em;
  }

  .description {
    margin-left: .5rem;
    font-size: .9em;
  }

  .date {
    position: absolute;
    right: calc(100% + 1rem);
    font-size: .8em;
    width: 100px;
    text-align: right;
  }

  &.claim {
    .line {
      border-color: var(--clr-pale-gray);
    }
  }
}
</style>