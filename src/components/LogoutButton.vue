<template>
    <NuxtLink class="logout-button" to="login" @click="logOut()"
        >Ekekesit</NuxtLink
    >
</template>

<script lang="ts" setup>
import { locStorage } from '@/stores/storage'
const roundKey = ref(0)

const logOut = () => {
    locStorage.removeData('myname')
}
</script>
