<template>
  <div class="progress" :style="{ height: parseInt(height) + 'px' }">
    <div
      class="progress-bar"
      :class="[
        `bg-${color}`,
        {
          'progress-bar-striped': striped,
          'progress-bar-animated': animated,
          'progress-bar-indeterminate': indeterminate && !value,
        },
      ]"
      role="progressbar"
      :style="{ width: `${value}%` }"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span>{{ label }}</span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  value: { type: Number, default: null },
  color: { type: String, default: "primary" },
  striped: { type: Boolean, default: false },
  animated: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  label: { type: String, default: "" },
  height: { type: [String, Number], default: "4px" },
});
</script>
<style>
.progress {
  height: 4px;
  background-color: rgba(var(--v-background-light), 0.1);
  border-radius: var(--v-border-radius-md);
  overflow: hidden;
  width: 100%;
  flex: 1;
  position: relative;
}
.progress-bar {
  height: 100%;
  transition: width 0.6s ease;
  background-color: rgba(var(--v-primary), 1);
  border-radius: var(--v-border-radius-md);
}
.progress-bar.bg-info {
  background-color: rgba(var(--v-info), 1);
}
.progress-bar.bg-success {
  background-color: rgba(var(--v-success), 1);
}
.progress-bar.bg-warning {
  background-color: rgba(var(--v-warning), 1);
}
.progress-bar.bg-danger {
  background-color: rgba(var(--v-danger), 1);
}
.progress-bar-striped {
  background-image: linear-gradient(
    45deg,
    rgba(var(--v-background-light), 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(var(--v-background-light), 0.15) 50%,
    rgba(var(--v-background-light), 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}
.progress-bar-animated {
  animation: progress-bar-stripes 1s linear infinite;
}
@keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}
.progress-bar-indeterminate {
  width: 25%;
  animation: progress-bar-indeterminate 1s linear infinite;
}
@keyframes progress-bar-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}
</style>
