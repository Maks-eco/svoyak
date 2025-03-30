<template>
    <button
        class="push-button"
        :class="{ inactivate: isInactivateButton }"
        @click="itsPushed()"
    >
        Жамк
    </button>
</template>

<script lang="ts" setup>
import { useCounterStore } from '@/stores/storage'

const store = useCounterStore()
const nameCode = ref('')
const nameStor = ref('')
const isNameInBase = ref(false)
const isInactivateButton = ref(false)

const itsPushed = async () => {
    isInactivateButton.value = true
    await store.userDoingTap(nameCode.value)
    setTimeout(() => {
        isInactivateButton.value = false
    }, 2500)
}

onMounted(async () => {
    const mynameStorage: string | null = locStorage.getData('myname')
    if (mynameStorage) {
        nameStor.value = mynameStorage
        if (nameStor.value) {
            const { isExist, id } = await store.isNameExistInBase(
                nameStor.value
            )
            if (!isExist) {
                isNameInBase.value = false
            } else {
                nameCode.value = id
                isNameInBase.value = true
            }
        }
    }
})
</script>

<style scoped lang="less">
.push-button {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    height: 150px;
    width: 300px;
    background: @common-primary-color;
    color: white;
    font-size: 40px;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    .shadow();

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
