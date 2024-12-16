<template>

  <Nuxt-Link class="list-item d-flex align-center  gap-2"
    :class="[{ 'is-link': to, dense }, `bg-${color || 'tonal'}`, `text-${textColor || 'white'}`]" :to="to || undefined"
    :disabled="disabled" tabindex="0" @keypress.enter="$emit('click')">
    <div v-if="icon" class="hide-on-mobile">
      <UI-Icon :icon="icon" :size="dense ? 16 : 32" :color="iconColor" />
    </div>
    <div :class="` truncate${truncate && subtitle ? '' : '-2'}`">
      <div v-if="badge" class="badge">{{ badge }}</div>
      <div v-if="title" class="truncate">{{ title }}</div>
      <div v-if="subtitle"
        :class="`${truncate ? 'truncate' : 'truncate-2'} text-muted text-caption ${dense ? 'mt-0' : 'mt-1'}`">
        {{ subtitle }}
      </div>
      <div v-if="footer" class="text-caption truncate text-muted-md mt-1">
        {{ footer }}
      </div>
      <slot name="body" />
    </div>
    <UI-Spacer />
    <div v-if="actionIcon" class="" @click.prevent="$emit('click:action')">
      <UI-Btn icon class="text-muted-xs is-link" :disabled="disabled">
        <UI-Icon :icon="actionIcon" :color="iconColor" />
      </UI-Btn>
    </div>
  </Nuxt-Link>

</template>
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: false },
  footer: { type: String, required: false },
  icon: { type: String, required: false },
  to: { type: String, required: false },
  color: { type: String, default: "tonal" },
  textColor: { type: String, default: "white" },
  iconColor: { type: String, default: "white" },
  actionIcon: { type: String, required: false },
  disabled: { type: Boolean, default: false },
  dense: { type: Boolean, default: false },
  truncate: { type: Boolean, default: false },
  badge: { type: String, required: false },
});
</script>
<style>
.list-item {


  border-radius: var(--v-border-radius);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 22px 16px;
  color: rgba(var(--v-text-color), 0.87);
  text-decoration: none;
  outline-color: rgba(var(--v-text-color), 1);
  outline-width: 1px;
  position: relative;
}

.list-item .badge {
  background-color: rgba(var(--v-secondary), 1);
  color: var(--v-primary);
  border-radius: 1px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 500;
  display: inline-block;
  position: absolute;
  top: 5px;
  right: 5px;
}

.list-item.dense {
  padding: 6px 10px;
}
</style>
