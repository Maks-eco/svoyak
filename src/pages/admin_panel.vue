<template>
    <button id="get_somethg" @click="itsPushed()">Get someth!</button>
    <p>admin panel</p>
    <p>{{ tapsState }}</p>
</template>

<script lang="ts" setup>
import useCounterStore from '@/stores/storage'

const itsPushed = async () => {
    store.clearPlayersTapState()
}
const store = useCounterStore()
const tapsState = ref('')
let ddd: any

onMounted(async () => {
    // console.log(
    //     'timestamp' + Date.now().toString().slice(-5),
    //     'timestamp' + Date.now()
    // )
    setInterval(async () => {
        ;({ string: tapsState.value, centered: ddd } =
            await store.getPlayersTapState())
        console.log('upd_tap_info', ddd)
    }, 2000)
})
// getPlayersTapState
</script>

<style scoped></style>
