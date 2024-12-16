<template>
  <div :class="[
    'card',
    color ? `bg-${color}` :
      '',
    maxHeight !== '100%' || height !== 'auto' ? 'scrollbar scrollbar-y' : '',
    { unborded },
  ]" :style="{ width, maxWidth, maxHeight, height }">
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
  maxWidth: {
    type: String,
    default: "100%",
  },
  maxHeight: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "auto",
  },
  unborded: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "",
  },
});
</script>
<style>
.card {
  background-color: rgba(var(--v-background-secondary), 1);
  border: 1px solid rgba(var(--v-border-color), 0.1);
  border-radius: var(--v-border-radius);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>
