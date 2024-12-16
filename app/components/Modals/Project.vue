<template>
    <UI-Modal @close="emit('close')" title="Assistant" subtitle="Create a new assistant" :loading="loading">
        <div class="cols gap-4">
            <UI-Input v-model="data.name" placeholder="Name" class="col-12" required />
            <UI-input v-model="data.description" placeholder="Description" class="col-12" required />
            <UI-Textarea v-model="data.instructions" placeholder="Instructions" class="col-12" rows="10" required />
            <!-- <UI-input v-model="data.model" placeholder="Model" class="col-12" required /> -->
            <UI-Select v-model="data.model" :options="models" placeholder="Model" class="col-12" required />

        </div>
        <template #footer>
            <div class="cols gap-4">
                <UI-Btn label="Create" color="primary" @click="createProject" :loading="loading" class="col-6"
                    :disabled="loading || !data.name || !data.description || !data.instructions" />
                <UI-Btn label="Cancel" @click="emit('close')" class="col-6" />
            </div>
        </template>
    </UI-Modal>
</template>

<script setup>
const emit = defineEmits(["close", "updated"]);
const { $user, $api } = useNuxtApp();
const models = ref([]);
const data = ref({
    model: 'gpt-4o'
});
const loading = ref(false);
const loadModels = async () => {
    const response = await $api.get("/chat/models");
    models.value = response.map((model) => {
        return {
            label: model.id,
            value: model.id,
        };
    });
};
const createProject = async () => {
    loading.value = true;
    const response = await $api.post("/projects", data.value);
    if (response && response.project) {
        navigateTo(`/projects/${response.project.id}`);
    }
    emit("updated");
    emit("close");
    loading.value = false;
};
onMounted(() => {
    loadModels();
});

</script>