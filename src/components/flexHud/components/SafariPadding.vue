<script setup lang="ts">
import { computed } from 'vue'
import { UAParser } from 'ua-parser-js'

const userAgent = new UAParser().getBrowser()

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false
})

const isSafari = computed(() => {
  return userAgent.name === 'Safari' || userAgent.name === 'Mobile Safari'
})
</script>

<template>
  <div v-if="isSafari && !props.disabled" class="safari-padding" />
</template>

<style scoped>
.safari-padding {
  padding: 3rem 0;
}
</style>
