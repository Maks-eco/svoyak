<template>
    <div>
        <div class="contol__wrapper">
            <div class="contol__get-answer" @click="getAnswer">Ответ</div>
            <NuxtLink
                @click="saveAnswer()"
                class="contol__to-menu"
                to="/playing_field"
                >В меню</NuxtLink
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['getAnswer'])

const props = defineProps({
    itemId: {
        required: true,
        type: String,
    },
    themeId: {
        required: true,
        type: String,
    },
})

const getAnswer = () => {
    emit('getAnswer')
}
import useCounterStore from '../stores/storage'

const store = useCounterStore()
const saveAnswer = () => {
    store.setAnsweredQuestion(props.themeId, props.itemId)
}
</script>

<style lang="less" scoped>
.contol {
    &__wrapper {
        position: fixed;
        left: 0;
        width: calc(100% - 24px);
        bottom: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 12px;
        padding: 12px;
    }

    &__get-answer {
        background-color: #67568c;
        color: white;
        cursor: pointer;
    }
    &__to-menu {
        background-color: gainsboro;
        color: #444;
    }

    &__get-answer,
    &__to-menu {
        font-size: 20px;
        padding: 20px 40px;
        border-radius: 20px;
        text-decoration: none;
    }
}
</style>
