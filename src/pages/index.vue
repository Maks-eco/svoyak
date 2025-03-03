<template>
    <SpamButton />
</template>

<script lang="ts" setup>
import { locStorage } from '@/stores/storage'

onMounted(() => {
    const nameStor: string | null = locStorage.getData('myname')
    if (nameStor === 'admin') {
        navigateTo('/admin_panel')
    }
    if (nameStor === 'pole') {
        navigateTo('/playing_field')
    }
})
</script>

<style scoped lang="less"></style>
