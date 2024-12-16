<template>
  <div :style="{ width: size + 'px', height: size + 'px' }" class="d-flex align-center">
    <svg v-if="iconSVG" :width="size" :height="size" :viewBox="iconSVG.viewBox" xmlns="http://www.w3.org/2000/svg">
      <path :d="iconSVG.path" :fill="colorFixed" />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: "16",
  },
  color: {
    type: String,
    default: "white",
  },
});

const colorFixed = computed(() => {
  if (props.color.startsWith("#")) {
    return props.color;
  }
  return `rgba(var(--v-${props.color}),1)`;
});

const iconSVG = ref(null);

const loadIcon = async () => {
  // Friki way to load icons from @mdi/js
  let iconName = props.icon;
  if (!iconName.startsWith('mdi')) {
    iconName = `mdi-${iconName}`;

  }

  iconName = iconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());



  const { [iconName]: icon } = await import("@mdi/js");
  iconSVG.value = {
    viewBox: "0 0 24 24",
    path: icon,
  };
};
onMounted(async () => {
  loadIcon();
});

watch(
  () => props.icon,
  () => {
    loadIcon();
  }
);
</script>
