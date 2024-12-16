<template>
  <ul class="breadcrumb">
    <li v-for="(item, index) in items" :key="index">
      <Nuxt-Link v-if="!item.current" :to="item.to">
        {{ item.label }}
      </Nuxt-Link>
      <span v-else>{{ item.label }}</span>
      <UI-Icon v-if="!item.current" icon="mdi-chevron-right" size="16" class="mx-1" />
    </li>
  </ul>
</template>
<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>
<style>
.breadcrumb {
  display: flex;
  list-style: none;
  color: rgba(var(--v-text-color), 0.5);
  background-color: rgba(var(--v-background-secondary), 1);

  border-radius: var(--v-border-radius-md);

  flex-wrap: wrap;
  padding: 10px 20px;
}

.breadcrumb li {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  color: rgba(var(--v-text-color), 0.8);
  text-decoration: none;
}
</style>
