<template>
    <UI-Modal @close="emit('close')" title="Upload" subtitle="Upload file to the project" :loading="loading">
        <div class="cols gap-4">
            <input type="file" id="input" class="hidden" @change="data.content = $event.target.files[0]"
                :accept="props.allow.join(', ')" />
            <UI-Card class="col-12 px-4 py-6 text-center is-link" color="dark" @click="openFile">
                <UI-Icon icon="mdi-file" size="46" class="mx-auto" />
                <div class="d-flex flex-column no-wrap gap-1">
                    <h3 class="">{{ data.content ? data.content.name : "Select File" }}</h3>

                    <p v-if="data.content" class="text-muted text-caption">{{ data.content ?
                        $utils.bytes.toSize(data.content.size) : "" }}
                    </p>
                    <small class="text-caption text-muted mt-2">
                        {{ props.allow.join(", ") }}
                    </small>
                </div>

            </UI-Card>

        </div>
        <template #footer>
            <div class="cols gap-4">
                <UI-Btn label="Upload" color="primary" @click="upload" :loading="loading" class="col-6"
                    prepend-icon="mdi-upload" :disabled="!data.content" />
                <UI-Btn label="Cancel" @click="emit('close')" class="col-6" :disabled="loading" />
            </div>
        </template>
    </UI-Modal>
</template>

<script setup>
const emit = defineEmits(["close", "updated"]);
const { $user, $api, $utils } = useNuxtApp();
const props = defineProps({
    project_id: {
        type: Number,
        required: false,
    },
    allow: {
        type: Array,
        default: () => [],
    },
});


const openFile = () => {

    document.getElementById("input").click();
};
const data = ref({
    content: "",
});
const loading = ref(false);

const upload = async () => {
    loading.value = true;
    // convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(data.value.content);
    reader.onload = async () => {
        const response = await $api.put(`/projects/${props.project_id}/files`, {
            name: data.value.content.name,
            content: reader.result,
        });
        loading.value = false;
        emit("updated", response.file);
        emit("close");
    };


};


</script>
<style scoped>
.hidden {
    display: none;
}
</style>