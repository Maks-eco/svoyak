<template>
    <br /><br /><br />
    <NameInput v-if="!isNameInBase" @nameSet="sendNewNameToBase()" />
    <IconСhoose @iconSet="(id:string) => saveImg(id)" />
    <button
        class="push-button"
        :class="{ inactivate: isInactivateButton }"
        @click="itsPushed()"
    >
        Жамк
    </button>
    <!-- <p>{{ isNameInBase ? 'Imja v base' : 'Ne naideno v base' }}</p> -->
</template>

<script lang="ts" setup>
import { useCounterStore } from '@/stores/storage'
import IconСhoose from './IconСhoose.vue'

const store = useCounterStore()
const nameCode = ref('')
const nameStor = ref('')
const isNameInBase = ref(false)
const isInactivateButton = ref(false)
const imgId = ref('1')

const saveImg = (id: string) => {
    console.log('i catch image: ', id)
    imgId.value = id
}

const itsPushed = async () => {
    isInactivateButton.value = true
    await store.userDoingTap(nameCode.value)
    setTimeout(() => {
        isInactivateButton.value = false
    }, 2500)
}

const sendNewNameToBase = async () => {
    const mynameStorage = localStorage.getItem('myname')
    nameStor.value = mynameStorage ? mynameStorage : ''
    store
        .sendNewNameToTheBase(nameStor.value, imgId.value)
        .then((id: string) => {
            nameCode.value = id
            isNameInBase.value = true
        })
}

onMounted(async () => {
    const mynameStorage = localStorage.getItem('myname')
    nameStor.value = mynameStorage ? mynameStorage : ''
    if (nameStor.value) {
        const { isExist, id } = await store.isNameExistInBase(nameStor.value)
        if (!isExist) {
            isNameInBase.value = false
        } else {
            nameCode.value = id
            isNameInBase.value = true
        }
    }
})
</script>

<style scoped lang="less">
.push-button {
    font-size: 40px;
    height: 150px;
    width: 300px;
    margin-left: 30px;
    background: @common-primary-color;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    cursor: pointer;

    &:hover {
        background: @common-secondary-color;
    }

    @media (max-width: 600px) {
        height: 150px;
        width: 80vw;
    }
}
.push-button.inactivate {
    pointer-events: none;
    user-select: none;
    background: linear-gradient(
        90deg,
        @warn-primary-color 0%,
        @warn-primary-color 50%,
        @warn-secondary-color 50%,
        @warn-secondary-color 100%
    );
    animation: timer_gradient calc(2.7s * 2) linear;
    background-size: 200% 200%;
}

@keyframes timer_gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}
</style>
