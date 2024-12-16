<template>
  <NuxtLink :to="disabled ? undefined : (to || undefined)" :disabled="disabled" class="menu-item"
    :title="title || sublabel || label" :class="[
      'd-flex',
      'no-wrap',
      'align-center',
      'gap-2',
      { active, alt, disabled, dense },
      `color-${color}`,
      `bg-${color}`,
      `text-${textColor}`,
    ]" @click="disabled ? null : $emit('click:item')">

    <UI-Icon v-if="icon" :icon="icon" :size="sublabel && !dense ? 24 : dense ? 14 : 16"
      :class="`mr-${sublabel && !dense ? 2 : 0}`" :color="iconColor || textColor" />

    <div v-if="label" :class="{ 'hide-on-mobile': labelHideOnMobile }" class="d-flex flex-column no-wrap truncate"
      :title="sublabel || label">
      <span class="label truncate">{{ label }}</span>
      <span v-if="sublabel" class="sublabel text-caption text-muted truncate">{{ sublabel }}</span>
    </div>
    <UI-Spacer v-if="count !== null || prependIcon || loading" />
    <template v-if="!loading">

      <div v-if="count !== null" class="count" :style="{ color: textColor }">{{ count }}</div>
      <UI-Icon v-if="prependIcon" :icon="prependIcon" :size="dense ? 14 : 16" :color="textColor" class="prepend-icon" />
    </template>
    <div v-else style="width: 25px">
      <UI-Progressbar indeterminate color="white" />
    </div>

  </NuxtLink>
</template>
<script setup>
const $emit = defineEmits(["click:item"]);
const props = defineProps({
  to: {
    type: String,
    default: undefined,
  },
  icon: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: "white",
  },
  prependIcon: {
    type: String,
    default: null,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: null,
  },
  sublabel: {
    type: String,
    default: null,
  },
  active: {
    type: Boolean,
    default: false,
  },
  labelHideOnMobile: {
    type: Boolean,
    default: false,
  },
  alt: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: null,
  },
  textColor: {
    type: String,
    default: "white",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
});
</script>
<style>
.menu-item {
  color: rgba(var(--v-text-color), 0.8);
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding: 10px 16px;
  font-weight: 300;
  border-radius: var(--v-border-radius);
}

.menu-item.dense {
  padding: 8px 12px;
  font-size: 0.8rem;
}

.menu-item.disabled {
  cursor: not-allowed;
  color: rgba(var(--v-text-color), 0.5);
  filter: grayscale(1);
  opacity: 0.5;
}


.menu-item.active {
  background: linear-gradient(90deg, rgba(var(--v-primary), 0.7), rgba(var(--v-primary), 11));
  color: rgba(var(--v-text-color), 1);
  box-shadow: 0 2px 10px rgba(var(--v-primary), 0.2);
}

.menu-item.active.alt {
  background: linear-gradient(90deg, rgba(var(--v-secondary-alt), 0.7), rgba(var(--v-secondary-alt), 11));
  color: rgba(var(--v-text-color), 1);
  box-shadow: 0 2px 10px rgba(var(--v-secondary-alt), 0.2);
}

.menu-item:not(.active):hover {
  background-color: rgba(var(--v-background-light), 0.1);
}

.menu-item .count {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: var(--v-border-radius);
  background-color: rgba(var(--v-background-light), 0.2);
  color: rgba(var(--v-text-color), 0.8);
}
</style>
