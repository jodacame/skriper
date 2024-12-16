<template>
  <div>
    <Modals-Profile v-if="openModal === 'profile'" @close="openModal = null" />
    <Modals-Project v-if="openModal === 'project'" @close="openModal = null" @updated="loadProjects" />

    <div :class="['sidebar ', { open: isOpen }]">
      <Nuxt-Link to="/" class="mx-auto text-center mt-2">
        <UI-Image src="/logo.png" alt="skriper" width="100px" class="logo" />
        <UI-Image src="/logo.png" alt="skriper" width="40px" class="mx-auto icon" />
      </Nuxt-Link>

      <div class="menu mt-6">


        <UI-Input v-model="query" prepend-icon="mdi-magnify" placeholder="Search..." class="mb-4 hide-on-close" />

        <UI-Menu-Item to="#" :active="false" label="New Assistant" prepend-icon="mdi-plus"
          @click="openModal = 'project'" class="mb-2" />
        <div class="scrollbar scrollbar-y" :style="{ height: 'calc(100vh - 390px)' }">
          <template v-for="item in projectsFiltered" :key="item.to">

            <UI-Menu-Item :active="isActive(item.id)" :to="`/project/${item.id}`" dense :label="item.name"
              :disabled="isLoading && !item.loading" :label-hide-on-mobile="isOpen ? false : true"
              class="menu-item mb-1" :icon="item.icon" :icon-color="isActive(item.id) ? 'white' : item.icon_color"
              :loading="item.loading" :class="['d-flex', 'no-wrap', 'align-center', 'gap-2', item.class]">
            </UI-Menu-Item>
          </template>

        </div>
      </div>
      <div class="spacer"></div>



      <hr class="divider my-4" />
      <UI-Menu-Item to="#" icon="mdi-account" dense label="Profile" @click:item="openModal = 'profile'"
        class="menu-item visible-on-mobile" />
      <UI-Menu-Item to="/login?logout=true" icon="mdi-logout" dense label="Logout" class="menu-item" />
      <UI-Menu-Item to="https://github.com/jodacame/skriper" icon="mdi-github" dense :label="version" class="menu-item"
        target="_blank" prepend-icon="mdi-open-in-new" />



      <div class="py-2">
        <UI-Btn to="#" class="d-flex no-wrap align-center gap-2 expand-link" @click="isOpen = !isOpen">
          <UI-Icon v-if="isOpen" icon="mdi-chevron-left" />
          <UI-Icon v-else icon="mdi-chevron-right" />
        </UI-Btn>
      </div>





    </div>
  </div>
</template>
<script setup>
const { $user, $api, $events } = useNuxtApp();
const config = useRuntimeConfig();


const route = useRoute();
const isOpen = ref(false);
const version = config.public.VERSION;
const currentPage = ref("");
const projects = ref([]);
const openModal = ref(null);
const query = ref("");


currentPage.value = route.path;

const projectsFiltered = computed(() => {
  return projects.value.filter((project) => {
    return project.name.toLowerCase().includes(query.value.toLowerCase()) || project.description.toLowerCase().includes(query.value.toLowerCase());
  });
});

const isLoading = computed(() => {
  return projects.value.some((project) => project.loading);
});
const loadProjects = async () => {
  const response = await $api.get("/projects");
  projects.value = response;
};
const isActive = (id) => {
  return parseInt(currentPage.value.split('/')[2]) === parseInt(id)
};
watch(
  () => route.path,
  async (value) => {
    currentPage.value = value;
  }
);

$events.on('project:updated', () => {
  loadProjects();
});
$events.on('project:used', (id) => {
  // move to top the project in the list
  const currentIndex = projects.value.findIndex((project) => project.id === id);
  if (currentIndex === 0) return;
  const project = projects.value.find((project) => project.id === id);
  projects.value = projects.value.filter((project) => project.id !== id);
  projects.value.unshift(project);
});

$events.on('project:thinking:start', (id) => {
  const project = projects.value.find((project) => project.id === id);
  project.loading = true;
});

$events.on('project:thinking:stop', (id) => {
  const project = projects.value.find((project) => project.id === id);
  project.loading = false;
});
onMounted(() => {
  loadProjects();

});
</script>
<style>
.expand-link {
  display: none !important;
}

.sidebar {
  background: rgba(var(--v-background), 1);


  padding: 16px;
  width: 220px;
  height: 100%;
  transition: width 0.1s;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}

.spacer {
  flex-grow: 1;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar .icon {
  display: none;
}



@media (max-width: 1020px) {
  .sidebar {
    width: 60px;
    transition: width 0.1s;
    padding: 10px;
    z-index: 1000;
  }

  .hide-on-close {
    display: none;
  }

  .sidebar.open {
    width: 250px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .sidebar.open .hide-on-close {
    display: block;
  }

  .sidebar.open .icon {
    display: none;
  }

  .sidebar.open .logo {
    display: block;
  }

  .sidebar.open .label {
    display: block;
  }

  .sidebar.open .menu a {
    justify-content: flex-start;
  }

  .expand-link {
    display: flex !important;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100%;

    background: rgba(var(--v-primary), 0.2);
    color: rgba(var(--v-text-color), 1);
    border-radius: var(--v-border-radius);
  }


  .menu>* {
    justify-content: center;
  }



  .sidebar .icon {
    display: block;
  }

  .sidebar .logo {
    display: none;
  }
}
</style>
<style>
@media (max-width: 1020px) {
  .menu-item .prepend-icon {
    display: none !important;
  }
}
</style>