<template>

    <Sidebar />
    <div class="page">
        <NuxtPage />
    </div>

</template>
<script setup>

useHead({
    title: "Skriper | Assistant",
    meta: [{
        name: "description",
        content: "Skriper Assistant"
    }],
    link: [{
        rel: "icon",
        type: "image/png",
        href: "/icon.png"
    }]
});
</script>