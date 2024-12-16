<template>
  <div class="list d-flex columns gap-1 flex-1">
    <UI-Input v-if="withSearch" v-model="query" placeholder="Search..." prepend-icon="mdi-magnify" class="mb-1" />
    <UI-Card class="scrollbar scrollbar-y list cols gap-1 pa-2" :style="{ maxHeight }">
      <UI-List-Item v-for="item in itemsFiltered" :key="item.key" :title="item.title" :subtitle="item.subtitle"
        :footer="item.footer" @click="() => $emit('click:item', item)" :icon="item.icon" :truncate="truncate"
        :to="item.to" :dense="dense" :badge="item.badge" :color="item.color || 'tonal'"
        :text-color="item.textColor || 'white'" :icon-color="item.iconColor || 'white'"
        :class="`is-link col-${12 / cols}`" />
    </UI-Card>
  </div>
</template>

<script setup>
const emit = defineEmits(["click:item"]);
const props = defineProps({
  items: { type: Array, required: true },
  withSearch: { type: Boolean, default: false },
  maxHeight: { type: String, default: "100%" },
  cols: { type: Number, default: 1 },
  dense: { type: Boolean, default: false },
  truncate: { type: Boolean, default: false },
});
const query = ref("");

const itemsFiltered = computed(() => {
  return props.items.filter((item) => {
    return (
      (item.title && item.title.toLowerCase().includes(query.value.toLowerCase())) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.value.toLowerCase())) ||
      (item.footer && item.footer.toLowerCase().includes(query.value.toLowerCase())) ||
      (item.badge && item.badge.toLowerCase().includes(query.value.toLowerCase()))
    );
  });
});
</script>
