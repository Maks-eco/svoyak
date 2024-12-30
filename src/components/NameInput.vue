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
// const numberOfPurchases = useCounterStore()
import { ref, onMounted } from 'vue'
const name = ref('')
const nameCode = ref('')
const storedName = ref('')

const emit = defineEmits(['nameSet'])

const saveName = () => {
    localStorage.setItem('myname', name.value)
    const lsName = localStorage.getItem('myname')
    storedName.value = lsName ? lsName : ''
    if (lsName) emit('nameSet')
}

onMounted(() => {
    const nameStor = localStorage.getItem('myname')
    if (nameStor) {
        storedName.value = name.value = nameStor
    }
})
</script>

<style scoped></style>
