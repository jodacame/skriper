<template>
    <UI-Modal @close="emit('close')" title="Profile" subtitle="Update your profile" :loading="loading">


        <div class="cols gap-4">
            <UI-Input v-model="data.email" placeholder="Email" readonly class="col-12" />
            <div class="col-12 cols gap-2">
                <div class="col-10">
                    <UI-Input v-model="data.password" type="password" placeholder="Password" prepend-icon="mdi-lock"
                        class="col-12">

                    </UI-Input>
                </div>
                <div class="col-2">
                    <UI-Btn label="Update" block color="primary" @click="updatePassword" :loading="updating.key" />
                </div>
            </div>
        </div>
    </UI-Modal>
</template>

<script setup>
const emit = defineEmits(["close"]);
const { $user, $api } = useNuxtApp();

const user = $user.get();
const data = ref({});
const loading = ref(false);

const updating = ref({
    key: false,
    password: false,
});
const loadUser = async () => {
    loading.value = true;
    const response = await $api.get("/user/me?fields=email");
    data.value = response.user;
    loading.value = false;
};

const updatePassword = async () => {
    updating.value.password = true;
    await $api.put("/user/password", {
        password: data.value.password,
    });
    updating.value.password = false;
    openModal.value = null;

};

onMounted(() => {
    loadUser();
});
</script>