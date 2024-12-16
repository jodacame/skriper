<template>
  <div
    :class="[`text-${type} alert alert-${type}  text-small d-flex align-center column  no-wrap pa-${dense ? 1 : 3} gap-${dense ? 2 : 3}`, { dense }]">
    <UI-Icon :icon="icons[type]" :size="dense ? 24 : 32" :color="type" :class="dense ? 'pl-2' : ''" />
    <div>
      <div class="font-weight-bold">{{ title }}</div>
      <div v-if="message" class="mt-1">
        {{ message }}
      </div>
    </div>
  </div>
</template>
<script setup>
const icons = {
  info: "mdi-information-outline",
  success: "mdi-check-circle-outline",
  warning: "mdi-alert-circle-outline",
  error: "mdi-alert-octagon-outline",
  danger: "mdi-alert-octagon-outline",
};
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "info",
  },
  dense: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped>
.alert {
  width: 100%;
  border-radius: var(--v-border-radius);
}

.alert-info {
  background: rgba(var(--v-info), 0.1);
}

.alert-success {
  background: rgba(var(--v-success), 0.1);
}

.alert-warning {
  background: rgba(var(--v-warning), 0.1);
}

.alert-danger,
.alert-error {
  background: rgba(var(--v-error), 0.1);
}
</style>
