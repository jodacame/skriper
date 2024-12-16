<template>
  <div
    :class="[horizontal ? 'd-flex no-wrap' : 'cols', { columns: !horizontal, fluid }, horizontal ? 'gap-1' : 'gap-1', '']">
    <UI-Menu-Item v-for="item in items" :key="item.key" :to="item.to" :active="active === item.key"
      @click:item="click(item)" :icon="noIcon ? null : item.icon" :label="item.label" :sublabel="item.sublabel"
      :title="item.title" :color="item.color" :text-color="item.textColor" :alt="alt" :count="item.count"
      :label-hide-on-mobile="item.labelHideOnMobile" :disabled="item.disabled || loading || disabled" class="is-link"
      :class="horizontal ? '' : `col-${12 / cols}`" />
  </div>
</template>
<script setup>
const emit = defineEmits(["selected", "click:item"]);
const props = defineProps({
  items: { type: Array, required: true },
  active: { type: String, default: null },
  alt: { type: Boolean, default: false },
  noIcon: { type: Boolean, default: false },
  horizontal: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fluid: { type: Boolean, default: false },
  cols: { type: Number, default: 1 },
});

const click = (item) => {
  emit("click:item", item);
  emit("selected", item);
};
</script>
