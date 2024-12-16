<template>
  <div class="spinner" :style="{ width: parseInt(size) + 'px', height: parseInt(size) + 'px' }"></div>
</template>
<script setup>
const props = defineProps({
  size: {
    type: [String, Number],
    default: "24px",
  },
});
</script>
<style scoped>
.spinner {
  border-radius: 50%;
  border: 2px solid rgba(var(--v-text-color), 0.1) !important;
  border-top-color: rgba(var(--v-text-color), 0.8) !important;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
