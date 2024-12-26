<template>
    <!-- <button @click="setLocale('en')">en</button>
    <button @click="setLocale('ru')">ru</button> -->
    <!-- <p>{{ $t('mes') }}</p> -->
    <!-- <metainfo /> -->
    <!-- <CartButton /> -->
    <!-- <CategoryList /> -->
    <!-- <ProductList /> -->
    <!-- <QuestionGrid /> -->
    <!-- <SpamButton /> -->
    <!-- <SpamButton /> -->
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
