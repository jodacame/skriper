<template>
    <div class="d-flex justify-center align-center h-100 center-on-mobile">

        <UI-Card max-width="400px" class="pa-6 text-center">
            <UI-Image src="/logo.png" alt="skriper" width="100px" class="mx-auto mt-2" />

            <div class="mt-4 w-100 gap-2 d-flex columns no-wrap">
                <UI-Input v-model="email" placeholder="Email" :disabled="loading" />
                <UI-Input v-model="password" placeholder="Password" type="password" :disabled="loading"
                    @enter="login" />
                <UI-Btn @click="login" color="primary" block :loading="loading"
                    :disabled="!email || !password">Login</UI-Btn>
            </div>
        </UI-Card>

    </div>
</template>
<script setup>
definePageMeta({
    layout: "guest",
});
const route = useRoute();
const { $api, $user } = useNuxtApp();


const email = ref("");
const password = ref("");
const loading = ref(false);

if (route.query.logout) {
    $user.logout();
}

const login = async () => {
    if (!email.value || !password.value) return;
    loading.value = true;
    const response = await $api.post("/login", {
        email: email.value,
        password: password.value,
    });
    loading.value = false;
    if (response && response.token) {
        $user.set(response.user);
        $user.token.set(response.token);
        navigateTo("/");
    }
};
</script>