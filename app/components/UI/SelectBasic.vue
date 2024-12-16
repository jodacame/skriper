<template>
  <div class="input">
    <p v-if="label" class="text-caption text-medium-emphasis mb-2 d-flex align-center no-wrap">
      {{ label }}
      <span v-if="required" class="text-warning mx-1">*</span>
      <UI-Spacer />
      <UI-Tooltip v-if="help" :text="help">
        <UI-Icon icon="mdi-help-circle" class="ml-1 text-muted" />
      </UI-Tooltip>
    </p>
    <div class="select" :style="{ maxWidth }" :class="{ 'has-icon': icon }">
      <UI-Icon v-if="icon" :icon="icon" class="icon" />
      <select :value="modelValue" :class="classes" @change="onChange" :disabled="disabled">
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <UI-Icon icon="mdi-chevron-down" class="icon-arrow" />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["input", "change"]);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: "100%",
  },
  label: {
    type: String,
    default: "",
  },
  help: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
});

const classes = computed(() => {
  return [
    {
      disabled: props.disabled.value,
      required: props.required.value,
    },
  ];
});

const onChange = (event) => {
  emit("input", event.target.value);
  emit("change", event.target.value);
  emit("update:modelValue", event.target.value);
};
</script>
<style scoped>
.input {
  width: 100%;
}
.input .select {
  width: 100%;
  border: var(--v-border);
  height: 40px;
  border-radius: var(--v-border-radius);
  color: rgba(var(--v-text-color), 0.8);
  cursor: pointer;
  position: relative;

  background-color: rgba(var(--v-background-input), 0.05);
}
.input .select select {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  color: inherit;
  font-size: 14px;
  cursor: pointer;
  padding: 0 10px;
  padding-right: 30px;
  -webkit-appearance: none; /* Safari y Chrome */
  -moz-appearance: none; /* Firefox */
  appearance: none; /* Estándar */
  background: none; /* Opcional: Elimina la flecha de fondo */
}

.input .select.has-icon select {
  padding-left: 35px;
}
.input .select .icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: rgba(var(--v-text-color), 0.8);
  pointer-events: none;
}
.input .select .icon-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: rgba(var(--v-text-color), 0.8);
  pointer-events: none;
}
.input:focus {
  border-color: rgba(var(--v-primary), 1);
}
.input.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.input.required {
  border-color: rgba(var(--v-danger), 1);
}
</style>
