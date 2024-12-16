<template>
  <div :class="['input-container', { block }]">
    <p v-if="label" class="text-caption text-medium-emphasis mb-2 d-flex align-center no-wrap">
      {{ label }}
      <span v-if="required" class="text-warning mx-1">*</span>
      <UI-Spacer />
      <UI-Tooltip v-if="help" :text="help">
        <UI-Icon icon="mdi-help-circle" class="ml-1 text-muted" />
      </UI-Tooltip>
    </p>
    <div :class="['input', 'd-flex', 'no-wrap', 'align-center', { disabled }]" :style="{ maxWidth }"
      :aria-required="required" :aria-invalid="message.text">
      <slot name="prepend" />

      <textarea ref="element" :value="modelValue" :placeholder="placeholder" :maxlength="maxlength" :rows="rows"
        class="pl-2" :readonly="readonly" :disabled="disabled" :autofocus="autofocus" :aria-required="required"
        :aria-invalid="message.text" :aria-describedby="message.text" :aria-label="label || placeholder"
        :aria-labelledby="label || placeholder" :min="min" :max="max" @input="onInput" @focus="isFocused = true"
        @blur="onBlur" @keydown="onKeyPress" :class="{ 'auto-resize': autoResize }"></textarea>
      <UI-Chip v-show="isFocused" size="x-small" label :color="modelValue.length >= maxlength ? 'warning' : 'primary'"
        v-if="maxlength && modelValue && counter" class="ma-2 font-weight-bold">
        {{ maxlength - modelValue.length }}
      </UI-Chip>

      <slot name="append" />
    </div>
    <p v-if="message.text" :class="['text-caption', `text-${message.type}`, 'mt-1']">
      {{ message.text }}
    </p>
  </div>
</template>

<script setup>
const emit = defineEmits(["input", "error", "enter", "backspace", "update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },

  maxlength: {
    type: Number,
    default: 9999,
  },
  autoResize: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  minlength: {
    type: Number,
    default: 0,
  },
  counter: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: "100%",
  },
  required: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  help: {
    type: String,
    default: "",
  },

  autofocus: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: [Number, String],
    default: 3,
  },
});

// Import emit

// Refs
const isFocused = ref(false);
const message = ref({
  text: "",
  type: "",
});
const element = ref(null);
let input = null;
const onKeyPress = (e) => {
  if (e.key === "Enter") {
    emit("enter");
  }
  if (e.key === "Backspace") {
    emit("backspace");
  }
};
// methods
const onInput = (value) => {
  if (props.disabled) {
    return;
  }
  value = value.target.value;

  // SANITIZE: Max length
  if (props.maxlength && value && value.length > props.maxlength) {
    value = value.slice(0, props.maxlength);
  }

  emit("update:modelValue", value);
  emit("input", value);
  const validate = validateInput(value);
  if (validate.text) {
    emit("error", validate.text);
    return value;
  }

  return value;
};
const validateInput = (value = null) => {
  if (!value) value = props.modelValue;
  // REQUIRED
  if (props.required && !value) {
    return (message.value = {
      text: "This field is required",
      type: "warning",
      icon: "mdi-alert-circle",
    });
  }

  if (value && props.minlength && value.length < props.minlength) {
    return (message.value = {
      text: "Minimum characters" + ` (${props.minlength - value.length})`,
      type: "warning",
      icon: "mdi-alert-circle",
    });
  }

  return (message.value = {
    text: "",
    type: "",
  });
};
const onBlur = () => {
  isFocused.value = false;
  // Validate if required
  validateInput(props.modelValue);
};

watch(
  () => message.value,
  (value) => {
    if (value.text) {
      emit("error", value.text);
    } else {
      emit("error", null);
    }
  }
);
onMounted(() => {
  if (props.autofocus) {
    input = element.value;

    if (input) {
      setTimeout(() => {
        input.focus();
      }, 1);
    }
  }
});
</script>
<style scoped>
.input {
  width: 100%;
  border: var(--v-border);
  min-height: 60px;
  border-radius: var(--v-border-radius);

  background-color: rgba(var(--v-background-input), 0.05);
}

.input-container {
  width: 100%;
}

.input.disabled {
  background-color: rgba(var(--v-background-input), 0.1);
  cursor: not-allowed;
}

.input textarea {
  flex-grow: 1;
  height: 100%;
  outline: 0;
  padding: 10px;
  min-width: 50px;
  min-height: 60px;
  color: rgba(var(--v-text-color), 0.8);
  font-family: var(--v-font-family);
}

.input:hover {
  border-color: rgba(var(--v-border-color), 0.8);
}

.input:focus-within {
  border-color: rgba(var(--v-border-color), 1);
  border-width: 1.5px;
  background-color: rgba(var(--v-background-input), 0.1);
}

.input-container.block {
  flex-grow: 1;
}

.help {
  opacity: 0;
  transition: 0.3s;
}

.help.show-help {
  opacity: 1;
  transition: 0.3s;
}

.auto-resize {
  form-sizing: normal;
}
</style>
