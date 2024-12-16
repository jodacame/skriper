<template>
  <div class="modal" ref="element">
    <div class="overlay" @click="close('OUTSIDE')"></div>
    <div class="modal-container " :style="{ maxWidth }">
      <div class="title d-flex align-center no-wrap py-2 px-4 gap-4">
        <div class="truncate">
          <div class="truncate h3">{{ title }}</div>
          <p v-if="subtitle" class="text-caption text-muted mt-1">{{ subtitle }}</p>
        </div>

        <UI-Spacer />
        <UI-Btn :loading="busy" @click="close('FORCE')" icon size="small" class="close">
          <UI-Icon icon="mdi-close" />
        </UI-Btn>
      </div>

      <div v-if="!loading" class="modal-slot scrollbar scrollbar-visible scrollbar-y" :style="{ maxHeight }"
        :class="[{ 'pa-4': !noPadding }]">
        <slot />
      </div>
      <div v-if="loading">
        <UI-Progressbar indeterminate />
      </div>
      <div :class="['footer', 'pa-4']" v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<script setup>
const { $modalManager } = useNuxtApp();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: "500px",
  },
  allowCloseOutside: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  busy: {
    type: Boolean,
    default: false,
  },


});
const element = ref(null);
const emit = defineEmits(["close"]);
const maxHeight = "calc(100vh - 300px)";

const close = (source) => {
  if (props.busy) return;
  if (props.persistent && source !== "FORCE") return;
  if (!props.allowCloseOutside && source === "OUTSIDE") return;
  if ($modalManager.getTop() === element.value) {
    emit("close");
    $modalManager.unregister(element.value); // Retira este modal de la pila
  }
};

const checkEscape = (e) => {
  if (e.key === "Escape" && !props.persistent) {
    close("ESCAPE");
  }
};

onMounted(() => {
  $modalManager.register(element.value); // Registra este modal
  window.addEventListener("keydown", checkEscape);
});
onUnmounted(() => {
  $modalManager.unregister(element.value); // Elimina este modal al desmontar
  window.removeEventListener("keydown", checkEscape);
});
onBeforeUnmount(() => {
  $modalManager.unregister(element.value); // Elimina este modal al desmontar
  window.removeEventListener("keydown", checkEscape);
});
</script>
<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  transition: all 0.3s ease;
  animation: overlay 0.3s ease;
}

.modal-container {
  position: relative;
  background: rgba(var(--v-background), 1);

  border-radius: var(--v-border-radius);
  z-index: 1002;
  box-shadow: var(--v-shadow);

  width: 100%;
  animation: modal 0.2s ease;
}

.modal .title,
.modal .footer {
  background: rgba(var(--v-background), 1)
}

.modal .title {
  border-bottom: 1px solid rgba(var(--v-text-color), 0.05);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.modal .footer {
  border-top: 1px solid rgba(var(--v-text-color), 0.1);
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);

}

.modal .close {
  background: rgba(var(--v-text-color), 0.05) !important;
}

.modal .close:hover {
  background: rgba(var(--v-text-color), 0.1) !important;
}

@keyframes modal {
  from {
    transform: scale(0.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes overlay {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
