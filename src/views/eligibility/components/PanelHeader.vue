<script setup lang='ts'>
</script>

<template>
  <div class='panel-header'>
    <slot />
  </div>
</template>

<style scoped lang='scss'>
.panel-header {
    padding: 1rem;
    font-weight: bold;
    background-color: var(--clr-light-purple);
    border-bottom: 1px solid var(--clr-light-purple-dark-5);
    border-top: 1px solid var(--clr-light-purple-dark-5);
    box-shadow: 0 0 3px 1px var(--clr-light-purple-dark-5);
    text-align: center;
  }
</style>