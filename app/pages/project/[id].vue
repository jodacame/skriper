<template>
    <div class="chat ">
        <div class="header">
            <div class="container ">
                <UI-Header :loading="loading" :title="project ? project.name : 'Loading...'"
                    :subtitle="(project && project.assistant ? ` ${project.description} | ${project.assistant.model}` : 'Waiting for assistant...')"
                    size="h3" class="mt-4">
                    <div class="d-flex no-wrap gap-2">
                        <UI-Btn icon @click="load">
                            <UI-Icon icon="mdi-refresh" />
                        </UI-Btn>
                        <UI-Btn icon @click="openShowEditProject">
                            <UI-Icon icon="mdi-text-box-edit" />
                        </UI-Btn>
                        <UI-Btn icon @click="deleteProject">
                            <UI-Icon icon="mdi-trash-can" color="warning" />
                        </UI-Btn>
                    </div>


                </UI-Header>

                <Modals-UploadFile v-if="openModal === 'upload'" @close="openModal = null" :project_id="project.id"
                    :allow="allowedFiles" @updated="loadFiles" />
            </div>

        </div>
        <div v-if="showEditProject" class="container">
            <UI-Card class="cols  gap-4 pa-4 mt-4" color="dark">
                <UI-Header title="Edit Project" subtitle="Edit the project details." icon="mdi-pencil" class="col-12" />

                <UI-Input v-model="data.name" label="Name" class="col-6" />
                <UI-Input v-model="data.description" label="Description" class="col-6" />
                <UI-Select v-model="data.model" :options="models" label="Model" required class="col-6" />
                <UI-Input v-model="data.icon" label="Icon" class="col-6">
                    <template #prepend>
                        <UI-Icon :icon="data.icon" :color="data.icon_color" class="ml-2" />
                    </template>
                    <template #append>
                        <div style="width: 60px;">
                            <UI-Input v-model="data.icon_color" type="color" no-padding />
                        </div>
                    </template>
                </UI-Input>


                <UI-Textarea v-model="data.instructions" label="Instructions" class="col-12" rows="10" />
                <UI-Btn @click="updateProject" class="col-6" color="primary" :loading="saving">
                    <UI-Icon icon="mdi-content-save" class="mr-2" />
                    <span>Save</span>
                </UI-Btn>
                <UI-Btn @click="closeEditProject" class="col-6">
                    <UI-Icon icon="mdi-close" class="mr-2" />
                    <span>Close</span>
                </UI-Btn>


                <UI-Hero title="Files" subtitle="Upload files to the project." icon="mdi-file-multiple"
                    :loading="loadingFiles" class="col-12">
                    <template #append>
                        <UI-Btn @click="openModal = 'upload'">
                            <UI-Icon icon="mdi-upload" class="mr-2" />
                            <span>Upload</span>
                        </UI-Btn>
                    </template>
                </UI-Hero>
                <div class="cols col-12 gap-2">
                    <UI-List-Item v-for="file in files" :key="file.id" :title="`${file.name} (${file.status})`"
                        :subtitle="$utils.bytes.toSize(file.size)"
                        :footer="new Date(file.created_at * 1000).toLocaleString()" action-icon="mdi-delete"
                        @click:action="deleteFile(file.file_id)" icon="mdi-file" class="col-6" />

                </div>



            </UI-Card>
        </div>
        <div v-if="!loading && !showEditProject" class="response scrollbar scrollbar-y">
            <div class="messages container">
                <div v-for="message in messages" :key="message.id" class="message" :class="message.role">
                    <div v-if="message.role === 'assistant'" class="avatar">
                        <UI-Logo-Icon size="32" />
                    </div>
                    <div>
                        <div class="name text-caption text-muted" v-if="message.role === 'assistant'">{{ project.name }}
                        </div>
                        <div :class="{ 'thinking': message.thinking }">


                            <UI-Markdown v-if="message.role === 'assistant'" :markdown="message.message" />
                            <div v-if="message.role === 'user'">{{ message.message }}</div>
                            <div v-if="message.attachment" class="mt-2">
                                <UI-Badge color="primary" icon="mdi-paperclip">{{
                                    message.attachment.filename }}
                                    ({{ $utils.bytes.toSize(message.attachment.bytes) }})
                                </UI-Badge>
                            </div>

                        </div>
                        <div v-if="message.role === 'assistant'" class="actions">
                            <UI-Btn size="small" @click="copyToClipboard(message.message)" icon>
                                <UI-Icon icon="mdi-content-copy" />
                            </UI-Btn>
                            <UI-Btn size="small" @click="deleteMessage(message.id)" icon>
                                <UI-Icon icon="mdi-delete" />
                            </UI-Btn>
                            <UI-Btn size="small" @click="addToBookmark(message.id)" icon>
                                <UI-Icon icon="mdi-bookmark-plus" />
                            </UI-Btn>

                        </div>
                    </div>
                </div>
            </div>
            <UI-Btn @click="goToBottom" icon class="fixed-bottom-right">
                <UI-Icon icon="mdi-arrow-down" />
            </UI-Btn>
        </div>
        <div v-if="!loading && !showEditProject" class="container">
            <div class="chat-input" :class="{ busy }">
                <UI-Textarea v-model="message" placeholder="Message" auto-resize autofocus
                    @keydown.enter="handleKeyPress" class="input" />
                <!-- <UI-Btn @click="chat" color="primary" class="ml-2 button" :loading="busy">
                <UI-Icon icon="mdi-send" size="32" />
            </UI-Btn> -->



            </div>
            <div class="mt-2 d-flex justify-end">
                <div v-if="attachment && !busy">
                    <UI-Badge color="primary" class="mr-2 is-link" :style="{ 'flex-grow': 1, 'flex': 1 }"
                        icon="mdi-paperclip" append-icon="mdi-close" @click="attachment = null">{{
                            attachment.name
                        }}</UI-Badge>
                </div>
                <UI-Btn @click="openAttachtment = true" color="primary" class="" size="small" :loading="busy">
                    <UI-Icon icon="mdi-paperclip" />
                </UI-Btn>
                <Modals-Attachtment v-if="openAttachtment" @close="openAttachtment = false" :allow="allowedFiles"
                    @file="addAttachtment" />
            </div>
        </div>
    </div>
</template>
<script setup>
const { $api, $utils, $toast, $events } = useNuxtApp();
const message = ref("");
const loading = ref(true);
const loadingFiles = ref(true);
const project = ref(null);
const route = useRoute();
const messages = ref([]);
const busy = ref(false);
const showEditProject = ref(false);
const openAttachtment = ref(false);
const data = ref({});
const saving = ref(false);
const openModal = ref(null);
const files = ref([]);
const attachment = ref(null);
const models = ref([]);
const allowedFiles = ["c", "cpp", "css", "csv", "doc", "docx", "gif", "go", "html", "java", "js", "json", "md", "pdf", "php", "pkl", "pptx", "py", "rb", "tar", "tex", "ts", "txt", "xlsx", "xml"]
    .map((ext) => "." + ext)





const loadProject = async () => {

    const response = await $api.get("/projects/" + route.params.id);
    project.value = response;
    data.value = {
        id: project.value.id,
        name: project.value.name,
        description: project.value.description,
        instructions: project.value.instructions,
        model: project.value.assistant.model,
        icon: project.value.icon,
        icon_color: project.value.icon_color

    };

};
const addAttachtment = (file) => {
    attachment.value = file;
};
const loadHistory = async () => {

    const response = await $api.post("/chat/history/", {
        ...project.value
    });
    messages.value = response;
    setTimeout(() => {
        $utils.scroll.toBottom(".response", false);

    }, 50);


};

const loadModels = async () => {
    const response = await $api.get("/chat/models");
    models.value = response.map((model) => {
        return {
            label: model.id,
            value: model.id,
            description: $utils.date.format(model.created * 1000),
            icon: 'mdi-robot'
        };
    });
};

const loadFiles = async () => {
    loadingFiles.value = true;
    const response = await $api.get("/projects/" + route.params.id + "/files");
    files.value = response;
    loadingFiles.value = false;
};

const openShowEditProject = () => {
    showEditProject.value = !showEditProject.value;
    if (showEditProject.value) {
        loadFiles();
    }
};

const closeEditProject = () => {
    showEditProject.value = false;
};

const deleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    if (!confirm("This action is irreversible. Are you sure you want to delete this project?")) return;
    await $api.delete("/projects/" + route.params.id);
    $events.emit("project:updated");
    $toast.success("Project deleted");
    navigateTo("/");
};

const updateProject = async () => {
    saving.value = true;
    const response = await $api.put("/projects/" + data.value.id, data.value);
    $events.emit("project:updated");
    await loadProject();
    // $toast.success("Project updated");
    showEditProject.value = false;
    saving.value = false;
    setTimeout(() => {
        $utils.scroll.toBottom(".response", false);
    }, 50);
};

const addToBookmark = async (id) => {
    // await $api.post("/chat/bookmark/" + project.value.id + "/" + id);
    $toast.success("Not implemented yet");
};

const deleteFile = async (id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    await $api.delete("/projects/" + route.params.id + "/files/" + id);
    files.value = files.value.filter((file) => file.file_id !== id);
};

const load = async () => {
    loading.value = true;
    await loadProject();
    await loadHistory();
    loading.value = false;
};
const handleKeyPress = (e) => {

    if (e.shiftKey) {
        return;
    }
    e.preventDefault();
    chat();


};


let controller = null


const chat = async () => {
    try {
        if (!message.value || busy.value) return;
        controller = new AbortController();
        const signal = controller.signal;
        busy.value = true;
        const messageText = message.value.split("\n").filter((line) => line.trim()).join("\n");
        messages.value.push({
            role: "user",
            message: messageText,
            attachment: attachment.value ? {
                filename: attachment.value.name,
                bytes: attachment.value.size
            } : null
        });
        messages.value.push({
            role: "assistant",
            message: "...",
            thinking: true
        });
        $events.emit("project:used", project.value.id);
        $events.emit("project:thinking:start", project.value.id);


        message.value = "";
        setTimeout(() => {
            $utils.scroll.toBottom(".response");
        }, 50);
        const response = await $api.postWhitStream("/chat/message", {
            ...project.value,
            message: messageText,
            attachment: attachment.value ? attachment.value : null
        }, {
            signal
        }, processResponse);

        attachment.value = null;

        messages.value[messages.value.length - 1] = {
            role: "assistant",
            message: response
        };

        $events.emit("project:thinking:stop", project.value.id);
        busy.value = false;
    } catch (error) {
        console.log(error);
        $toast.error("An error occurred. Please try again.");
        busy.value = false;
        attachment.value = null;
    }

};

const cancelChat = () => {
    controller.abort();
    busy.value = false;
    $events.emit("project:thinking:stop", project.value.id);
};

const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    if (!confirm("This action is irreversible. Are you sure you want to delete this message?")) return;

    const response = await $api.delete("/chat/message/" + project.value.id + "/" + id);
    if (response && response.success) {
        messages.value = messages.value.filter((message) => message.id !== id);
    }

};

const copyToClipboard = (text) => {
    $utils.copyToClipboard(text);
    $toast.success("Copied to clipboard");
};
const processResponse = (response) => {

    messages.value[messages.value.length - 1] = {
        role: "assistant",
        message: response
    }
    setTimeout(() => {
        $utils.scroll.toBottom(".response");
    }, 100);
};

const goToBottom = () => {
    $utils.scroll.toBottom(".response");
};


useHead({
    title: `Loading...`,
});


onMounted(async () => {
    loadModels();
    await load();
    useHead({
        title: `Skriper |  ${project.value ? project.value.name : "Loading..."} - ${project.value ? project.value.description.substring(0, 50) : "Loading..."}`,
        meta: [{
            name: "description",
            content: project.value ? project.value.description : "Loading..."
        }]
    });


});
</script>
<style>
.header {
    background: rgba(var(--v-background), 1);
    border-bottom: 1px solid rgba(var(--v-background), 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}



.chat {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-bottom: 16px;
    font-size: 16px;



}

.chat .response {
    flex-grow: 1;
    padding: 16px;

}

.chat .fixed-bottom-right {
    position: fixed;
    right: 16px;

    bottom: 20px;
}



.chat .response .messages {

    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.chat .response .message {
    line-height: 1.5;
    display: flex;
    gap: 10px;
    white-space: pre-line;
    transition: all 0.3s;
    animation: fadeIn 0.5s;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 15px;
    border-radius: 8px;
    position: relative;
    max-width: 90%;


}



.chat .response .message .thinking {
    position: relative;
    animation: thinking 0.5s infinite;
}



.chat .response .message div {

    word-wrap: break-word;
    max-width: 100%;

}



.chat .response .message .avatar {
    margin-top: 5px;
    width: 36px;
    height: 36px;
}

.chat .response .message .avatar img {
    width: 36px;
    height: 36px;
    object-fit: cover;
    margin-left: -58px;

}

.chat .response .message .actions {
    display: flex;
    gap: 8px;
    position: absolute;
    bottom: 8px;
    right: 9px;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s;
    border-radius: 8px;
    padding: 4px;
    background-color: rgba(0, 0, 0, 0.8);
}

.chat .response .message:hover .actions {
    visibility: visible;
    opacity: 1;
}

.chat .response .message.user {
    padding: 8px;
    margin: 8px 0;
    border-radius: 8px;
    background-color: rgba(var(--v-primary), 0.3);
    align-self: flex-end;

}

.chat .chat-input {


    display: flex;
    align-items: center;
    width: 100%;

    border-radius: 8px;

}



.chat-input.busy .input {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.1);
}

.chat .chat-input .input textarea {
    border: 0 !important;
    resize: none;
    font-size: 16px;
}

.chat .chat-input .input {
    border: 0 !important;
    margin: 0 auto;

    background-color: rgb(240, 240, 240, 0.05);
}



.spacer {
    flex-grow: 1;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* thinking: Animate fadeit letter by letter */
@keyframes thinking {
    0% {
        opacity: 0;

    }

    50% {
        opacity: 1;

    }

    100% {
        opacity: 0;

    }

}

@keyframes aura {
    0% {
        box-shadow: 0 0 10px rgba(var(--v-primary), 0.5);
    }

    50% {
        box-shadow: 0 0 50px rgba(var(--v-primary), 0.8);
        opacity: 0.5;
    }

    100% {
        box-shadow: 0 0 10px rgba(var(--v-primary), 0.5);
    }
}
</style>