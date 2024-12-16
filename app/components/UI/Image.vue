<template>
  <img :src="src" :alt="alt" :width="width" :height="height" loading="lazy" />
</template>
<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "auto",
  },
});
</script>
