<template>
  <button :class="[
    'btn',
    'text-uppercase',
    `bg-gradient-${color}`,
    `text-white`,
    'd-flex',
    'no-wrap',
    'justify-center',
    'align-center',
    { 'btn-icon': icon },
    { 'flex-1': block },
    `btn-${size}`,
  ]" @click="click" :disabled="loading || disabled">
    <UI-Icon v-if="prependIcon && !loading" :icon="prependIcon" class="mr-1" />

    <UI-Spinner v-if="loading" />

    <div v-else class="label">
      <slot v-if="!label" />
      <span v-else>{{ label }}</span>
    </div>
    <UI-Icon v-if="appendIcon && !loading" :icon="appendIcon" class="ml-1" />
  </button>
</template>
<script setup>
const emit = defineEmits(["click"]);
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "",
  },
  icon: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "normal",
  },
  prependIcon: {
    type: String,
    default: "",
  },
  appendIcon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});
const click = () => {
  if (!props.loading && !props.disabled) {
    emit("click");
  }
};
</script>
<style scoped>
.btn {
  background: rgba(var(--v-background-alt), 1);
  border: none;
  border-radius: var(--v-border-radius);
  color: rgba(var(--v-text-color), 0.8);
  cursor: pointer;
  min-height: 40px;

  padding: 0 20px;
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  transition: background-color 0.3s;
}



.btn .label {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.btn-small {
  min-height: 30px;
  padding: 0 10px;
}

.btn[disabled] {
  cursor: not-allowed;
  filter: grayscale(0.9) brightness(0.5);
  user-select: none;
}

.btn:not([disabled]):hover {
  filter: brightness(0.6);
}

.btn:not([disabled]):active {
  filter: brightness(0.9);
}

.btn.btn-icon {
  padding: 0;
  min-height: 40px;
  max-height: 40px;
  min-width: 40px;
  max-width: 40px;
  border-radius: 50%;
  background: rgba(var(--v-background), 0.5);
}

.btn.btn-icon.btn-small {
  min-height: 25px;
  max-height: 25px;
  min-width: 25px;
  max-width: 25px;
}
</style>
