<template>
  <span :class="[
    'badge',
    'px-2',
    `bg-${color}`,
    `text-white`,

    `align-center`,
    `badge-${size}`,
    { 'badge-pill': pill },
  ]">
    <UI-Icon v-if="icon" :icon="icon" class="mr-1" size="10" />
    <span v-if="label">{{ label }}</span>
    <slot v-else />
    <UI-Spacer v-if="appendIcon" />
    <UI-Icon v-if="appendIcon" :icon="appendIcon" class="ml-1" size="10" />
  </span>
</template>
<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "normal",
  },
  pill: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  appendIcon: {
    type: String,
    default: "",
  },
});
</script>
<style>
.badge {
  font-size: 0.75rem;
  display: inline-flex;
  height: 100%;

  padding: 0.25em 0.4em;
  border-radius: var(--v-border-radius);
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;

}

.badge-small {
  font-size: 0.5rem;
  padding-top: 0.15em;
  padding-bottom: 0.15em;
  padding-left: 0.4em;
  padding-right: 0.4em;
}

.badge-pill {
  border-radius: 10rem;
}
</style>
