<template>
    <SpamButton />
</template>

<script lang="ts" setup>
onMounted(() => {
    const nameStor = localStorage.getItem('myname')
    if (nameStor === 'admin') {
        navigateTo('/admin_panel')
    }
    if (nameStor === 'pole') {
        navigateTo('/playing_field')
    }
})
</script>

<style scoped></style>
