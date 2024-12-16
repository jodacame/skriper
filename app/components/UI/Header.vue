<template>
  <div class="mb-4">
    <div class="d-flex align-center w-100 gap-2 ">
      <div>
        <div :class="size" class="font-weight-bold">{{ title }}</div>
        <p v-if="subtitle" class="text-muted mt-1">{{ subtitle }}</p>
        <slot name="header" />
      </div>
      <UI-Spacer />

      <slot />

    </div>
    <template v-if="search">
      <UI-Input v-model="query" placeholder="Search for name or description..." class="mt-4">
        <template #prepend>
          <UI-Icon icon="mdi-magnify" class="ml-2" />
        </template>
      </UI-Input>
    </template>
    <UI-Progressbar v-if="loading" indeterminate class="my-2" />
    <UI-Breadcrumb v-if="breadcrumb && breadcrumb.length" :items="breadcrumb" class="mt-2" />
  </div>
</template>
<script setup>
const emit = defineEmits(["search"]);
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  search: {
    type: [Boolean, String],
    default: false,
  },
  size: {
    type: String,
    default: "h1",
  },
  breadcrumb: {
    type: Array,
    default: () => [],
  },
});
const query = ref("");
if (typeof search === "string") query.value = search;
watch(query, () => emit("search", query.value));
</script>
