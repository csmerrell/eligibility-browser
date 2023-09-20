<script setup lang="ts"></script>

<template>
  <div ref="headerEl" class="hud-header">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.hud-header {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--fh-bg);
  z-index: 1;

  border-bottom: 1px solid var(--fh-secondary);
  box-shadow: 0 0 5px 0.5px var(--fh-secondary);

  .align-right {
    justify-self: flex-end;
    display: flex;
    flex-flow: row;
    align-items: center;
    column-gap: 0.5rem;
  }
}
</style>
