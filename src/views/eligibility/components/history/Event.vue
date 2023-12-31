<script setup lang="ts">
//vue
import { computed, onMounted, ref } from 'vue'

//util
import { formatDate } from '@/util/dates/formatDate'

//types
import type { RenderedEvent } from '@/views/eligibility/model/Event'

const props = defineProps<RenderedEvent>()
const { desc, date, type, position, length } = props
const el = ref<HTMLDivElement | null>(null)
const lineEl = ref<HTMLDivElement | null>(null)

onMounted(() => {
  setTimeout(() => {
    if (!el.value || !lineEl.value) return
    el.value.style.setProperty('--top', `${position.y}px`)
    el.value.style.setProperty('--left', `${position.x}px`)
    el.value.style.setProperty('opacity', '1')
    if (!isClaim.value) {
      lineEl.value.style.setProperty('--width', length)
    }
    emit('visibleStylesSet')
  }, 100)
})

const isClaim = computed(() => {
  return type === 'claim'
})

const emit = defineEmits(['visibleStylesSet'])
</script>

<template>
  <div ref="el" class="event" :class="{ claim: isClaim }">
    <div class="event-contents">
      <div ref="lineEl" class="line"></div>
      <div v-if="!isClaim" class="description">{{ desc }}</div>
      <div v-if="!isClaim" class="date">{{ formatDate(date) }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event {
  position: absolute;
  opacity: 0;
  left: 0;
  right: 0;
  transition: opacity 0.3s ease-in;

  --top: 0;
  --left: 0;
  --width: 0;

  top: var(--top);
  left: var(--left);

  .line {
    width: var(--width);
    border-top: 1px solid var(--clr-mid-gray);
  }

  .event-contents {
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: 0.5em;
  }

  .description {
    margin-left: 0;
    font-size: 0.9em;
  }

  .date {
    position: absolute;
    right: calc(100% + 1rem);
    font-size: 0.8em;
    width: 100px;
    text-align: right;
  }

  &.claim {
    .line {
      width: 100%;
      border-color: var(--clr-pale-gray);
    }
  }
}
</style>
