<template>
    <div>
        <div class="delete-button__wrapper">
            <button
                class="delete-button__button"
                @click="isStartDeletion = true"
            >
                Удолить
            </button>
        </div>
        <div class="approve-window__wrapper" v-show="isStartDeletion">
            <div class="approve-window__message">
                Tochno ydalit???
                <button @click="deleteHim()">Удолить</button>
                <button @click="isStartDeletion = false">Nonono</button>
            </div>

            <div class="approve-window__background"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isStartDeletion = ref(false)
const emit = defineEmits(['approvedDeletion'])

const deleteHim = () => {
    isStartDeletion.value = false
    emit('approvedDeletion')
}
</script>

<style lang="less" scoped>
.delete-button {
    &__wrapper {
    }
    &__button {
        border: 1px solid red;
    }
}

.approve-window {
    &__wrapper {
    }
    &__message {
        position: fixed;
        left: 50%;
        top: 50%;
        background: white;
        padding: 50px;
        border-radius: 20px;
        z-index: 10;
        transform: translate(-50%, -50%);
    }
    &__background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(128, 128, 128, 0.445);
        z-index: 5;
    }
}
</style>
