<template>
    <UI-Modal @close="emit('close')" title="Preview" no-padding max-width="800px" max-height="90%" allow-close-outside>
        <div class="gap-0">
            <iframe :srcdoc="codeFixed" class="col-12" :style="{ height: 'calc(100vh - 200px)', width: '100%' }">
            </iframe>

        </div>

    </UI-Modal>
</template>

<script setup>
const emit = defineEmits(["close", "updated"]);
const { $user, $api, $utils } = useNuxtApp();
const props = defineProps({
    code: {
        type: String,
        required: false,
        // Base64 encoded
    },

});

const codeFixed = computed(() => {
    return atob(props.code);
});

</script>
