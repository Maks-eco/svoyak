<template>
    <div>
        <div class="delete-button__wrapper">
            <button
                class="delete-button__button"
                @click="isStartDeletion = true"
            >
                <img class="delete-icon" alt="some" src="@/public/close.svg" />
            </button>
        </div>
        <div class="approve-window__wrapper" v-show="isStartDeletion">
            <div class="approve-window__message">
                Удалить игрока?
                <button class="approve-window__button" @click="deleteHim()">
                    Удолить
                </button>
                <button
                    class="approve-window__button"
                    @click="isStartDeletion = false"
                >
                    Nonono
                </button>
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
        border: none;
        cursor: pointer;
        background-color: transparent;
    }
}

.delete-icon {
    height: 24px;
    width: 24px;
}

.approve-window {
    &__wrapper {
    }
    &__message {
        display: flex;
        gap: 8px;
        align-items: center;
        position: fixed;
        left: 50%;
        top: 50%;
        background: white;
        padding: 50px;
        border-radius: 20px;
        z-index: 30;
        transform: translate(-50%, -50%);
    }
    &__background {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(128, 128, 128, 0.445);
        z-index: 20;
    }
    &__button {
        .secondary-info-button();
    }
}
</style>
