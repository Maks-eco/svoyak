<template>
    <div>
        <span>{{ storedName ? 'Твой ник: ' + storedName : 'Введи ник:' }}</span>
        <br />
        <input type="text" v-model="name" maxlength="20" />
        <!-- <span>{{ name }}</span> -->
        <br />
        <button @click="saveName">Store</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { locStorage } from '@/stores/storage'

const name = ref('')
const storedName = ref('')

const emit = defineEmits(['nameSet'])

const saveName = () => {
    if (name.value !== '') {
        storedName.value = name.value
        emit('nameSet', name.value)
    }
}

onMounted(() => {
    const nameStor: string | null = locStorage.getData('myname')
    if (nameStor) {
        storedName.value = name.value = nameStor
    }
})
</script>

<style scoped></style>
