<template>
    <button class="logout-button" @click="logOut()">Ekekesit</button>
</template>

<script lang="ts" setup>
import { locStorage } from '@/stores/storage'
const roundKey = ref(0)

const logOut = () => {
    locStorage.removeData('myname')
    locStorage.removeData('browserId')
    // roundKey.value++
    // navigateTo('/')
}
</script>
