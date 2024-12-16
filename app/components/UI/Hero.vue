<template>
  <UI-Card class="d-flex align-center center-on-mobile gap-4 pa-4">
    <UI-Icon :icon="icon" size="46" :color="iconColor" />
    <div class="d-flex flex-column no-wrap gap-1">

      <h3 class="">{{ title }}</h3>
      <p class="text-muted">
        {{ subtitle }}
      </p>
      <div v-if="loading" class="d-flex align-center gap-2">
        <UI-Progressbar indeterminate class="" />
      </div>
    </div>

    <UI-Spacer />
    <slot name="append" />
    <UI-Btn v-if="action && action.icon" :color="action.color || 'info'" @click="emit('click:action')">
      <UI-Icon :icon="action.icon" class="mr-2" />
      <span v-if="action.label">{{ action.label }}</span>
    </UI-Btn>
    <slot name="prepend" />
  </UI-Card>
</template>
<script setup>
const emit = defineEmits(["click:action"]);
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  icon: { type: String, required: false },
  action: { type: Object, required: false },
  iconColor: { type: String, default: "white" },
  loading: { type: Boolean, default: false },
});
</script>
