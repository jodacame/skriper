<template>
    <div class="container">
        <div class="pt-6">
            <UI-Header title="Welcome to Skriper" subtitle="The most powerful assistant for your projects" search
                @search="query = $event" :loading="loading" />
            <div class="cols gap-4">
                <div class="col-4" v-for="project in projectsFiltered" :key="project.id">
                    <UI-List-Item :to="`/project/${project.id}`" :icon="project.icon" :title="project.name"
                        :subtitle="project.description" :count="project.count" :prepend-icon="project.prependIcon"
                        :loading="project.loading" />
                </div>

            </div>

        </div>
    </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const projects = ref([]);
const query = ref("");
const loading = ref(true);

const loadProjects = async () => {
    loading.value = true;
    const response = await $api.get("/projects");
    projects.value = response;
    loading.value = false;
};

const projectsFiltered = computed(() => {
    return projects.value.filter((project) => {
        return project.name.toLowerCase().includes(query.value.toLowerCase()) || project.description.toLowerCase().includes(query.value.toLowerCase());
    });
});

onMounted(() => {
    loadProjects();
});
</script>