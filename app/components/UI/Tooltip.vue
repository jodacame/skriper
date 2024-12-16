<template>
  <div :class="`tooltip ${disabled ? 'disabled' : ''} ${$slots.tooltip ? 'has-slot' : ''} `">
    <div v-if="tooltip || text || $slots.tooltip" class="tooltip-container">
      <slot v-if="!tooltip && !text" name="tooltip"> </slot>
      <span>{{ tooltip || text }}</span>
    </div>
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  tooltip: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
<style>
.tooltip {
  position: relative;
}
.tooltip.disabled {
  pointer-events: none;
  cursor: not-allowed;
}
.tooltip:hover .tooltip-container {
  display: block;
}
.tooltip-container {
  position: absolute;
  top: 50%;
  left: 50%;

  width: max-content;
  max-width: 200px;
  max-height: initial;
  display: none;

  overflow: hidden;

  white-space: break-spaces;

  backdrop-filter: blur(10px);
  border: var(--v-border);

  color: rgba(var(--text-color), 0.9);
  padding: 0.3rem 0.5rem;
  border-radius: 1px;
  z-index: 9999;

  box-shadow: var(--v-shadow);
  text-transform: initial;
  margin-top: 10px;
  margin-left: 10px;
}

.tooltip.has-slot .tooltip-container {
  padding: 0;
  max-width: unset;
}
</style>
