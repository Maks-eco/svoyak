<template>
    <div>
        <input type="text" v-model="name" />
        <span>{{ name }}</span> <br />
        <span>{{ name ? 'Youre imya: ' + name : 'Vvedite imya' }}</span> <br />
        <button @click="saveName">Store</button>
    </div>
</template>

<script lang="ts" setup>
// const numberOfPurchases = useCounterStore()
import { ref, onMounted } from 'vue'
const name = ref('')
const nameCode = ref('')
const saveName = () => {
    localStorage.setItem('myname', name.value)
}

onMounted(() => {
    const nameStor = localStorage.getItem('myname')
    if (nameStor) {
        name.value = nameStor
    }
})
</script>

<style scoped></style>
