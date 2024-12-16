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
                    <small v-else class="text-caption text-muted mt-2">
                        {{ props.allow.join(", ") }}
                    </small>
                </div>

            </UI-Card>

        </div>
        <template #footer>
            <div class="cols gap-4">
                <UI-Btn label="Add" color="primary" @click="process" :loading="loading" class="col-6"
                    prepend-icon="mdi-plus" :disabled="!data.content" />
                <UI-Btn label="Cancel" @click="emit('close')" class="col-6" :disabled="loading" />
            </div>
        </template>
    </UI-Modal>
</template>

<script setup>
const emit = defineEmits(["close", "file"]);
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

const process = async () => {
    loading.value = true;
    const reader = new FileReader();
    reader.readAsDataURL(data.value.content);
    reader.onload = async () => {
        loading.value = false;
        emit("file", {
            name: data.value.content.name,
            content: reader.result,
            size: data.value.content.size,
        });
        emit("close");
    };


};


</script>
<style scoped>
.hidden {
    display: none;
}
</style>