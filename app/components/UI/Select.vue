<template>
  <div :class="`input ${disabled ? 'disabled' : ''}`">
    <p v-if="label" class="text-caption text-medium-emphasis mb-2 d-flex align-center no-wrap">
      {{ label }}
      <span v-if="required" class="text-warning mx-1">*</span>

      <UI-Tooltip v-if="help" :text="help">
        <UI-Icon icon="mdi-help-circle" class="ml-1 text-muted" />
      </UI-Tooltip>
    </p>
    <div class="select truncate" tabindex="0" @keydown.enter="openModal" :style="{ maxWidth }" @click="openModal"
      :class="classes">
      <div class="d-flex align-center no-wrap truncate">
        <UI-Icon v-if="selected.icon" :icon="selected.icon" :color="selected.iconColor" class="ml-2" />
        <div class="truncate mx-2">
          <div :class="`label truncate`">
            {{ selected.label || placeholder }}
          </div>
          <div v-if="selected.description" class="text-caption caption text-muted truncate">
            {{ selected.description }}
          </div>
        </div>
      </div>
      <UI-Spacer />
      <UI-Icon icon="mdi-list-box" class="mr-2" />
    </div>
    <UI-Modal v-if="open" :title="label || 'Select'" :subtitle="placeholder || 'Select an option'" :maxheight="400"
      :maxwidth="350" @close="open = false">
      <UI-List dense :with-search="options.length > 5" max-height="300px" :items="optionsFixed"
        @click:item="selectItem" />

      <slot name="footer" />
    </UI-Modal>
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
  returnObject: {
    type: Boolean,
    default: false,
  },
});
const open = ref(false);

const optionsFixed = computed(() => {
  const options = props.options.map((o) => ({
    title: o.label,
    icon: o.icon,
    subtitle: o.description,
    item: o,
    color: o.color,
    textColor: o.textColor,
    iconColor: o.iconColor,
  }));
  if (!props.required) {
    options.unshift({
      title: "None",
      icon: "mdi-close",
      subtitle: "No value selected",
      item: null,
    });
  }
  return options;
});
const classes = computed(() => {
  return [
    {
      disabled: props.disabled,
      required: props.required,
    },
  ];
});

const selected = computed(() => {
  return (
    props.options.find((o) => o.value === props.modelValue) || {
      label: props.placeholder,
      icon: "",
      description: "",
    }
  );
});

const selectItem = (item) => {
  if (props.returnObject) {
    emit("input", item.item);
    emit("change", item.item);
    emit("update:modelValue", item.item);
    open.value = false;
    return;
  }
  if (item.item) {
    emit("input", item.item.value);
    emit("change", item.item.value);
    emit("update:modelValue", item.item.value);
  } else {
    emit("input", null);
    emit("change", null);
    emit("update:modelValue", null);
  }
  open.value = false;
};

const openModal = () => {
  if (props.disabled) return;
  open.value = true;
};
</script>
<style scoped>
.input {
  width: 100%;
  cursor: pointer;
}

.input.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.input:hover .select {
  background-color: rgba(var(--v-background-input), 0.1);
  border-color: rgba(var(--v-text-color), 0.8);
}

.input .select {
  width: 100%;
  border: var(--v-border);
  height: 40px;
  border-radius: var(--v-border-radius);
  color: rgba(var(--v-text-color), 0.8);

  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(var(--v-background-input), 0.05);
  outline-color: rgba(var(--v-text-color), 1);
  outline-width: 1px;
}

.input.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.input.required {
  border-color: rgba(var(--v-danger), 1);
}

.input .caption {
  overflow: hidden;
  max-height: 0;
  transition: 0.2s;
  opacity: 0;
}

.input:hover .caption {
  display: block;
  transition: 0.2s;
  max-height: 20px;
  opacity: 0.5;
}
</style>
