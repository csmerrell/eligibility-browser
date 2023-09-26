<script setup lang="ts"></script>

<template>
  <div class="main-header">
    <h2>Insurance Eligibility Browser</h2>
    <div class="spacer" />
    <a target="_blank" href="https://github.com/csmerrell/eligibility-browser/blob/main"
      >View Source</a
    >
  </div>
</template>

<style lang="scss">
.main-header {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  h2 {
    margin: 1rem;
  }
  .spacer {
    flex-grow: 1;
  }
  a {
    padding: 0 2rem;
  }
}
</style>
