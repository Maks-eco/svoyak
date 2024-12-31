<template>
    <div class="theme__wrapper">
        <div class="theme__list" v-if="round">
            <div
                class="theme__row"
                v-for="theme in round?.themes"
                :theme="theme.id"
            >
                <div class="theme__name">
                    {{ theme.name }}
                </div>
                <OneQuestion
                    class="theme__question"
                    v-for="question in theme.questions"
                    :item="question"
                    :theme-id="theme.id"
                />
            </div>
        </div>
        <button class="hidden_button" @click="nextRound()">Next round</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Round } from '@/types/GameEntities'
import OneQuestion from './OneQuestion.vue'
import useCounterStore from '@/stores/storage'

const store = useCounterStore()

const round = ref(null as Round | null)

const nextRound = () => {
    console.log('rv', round.value?.id)
    store.globalRound(round.value?.id)
    localStorage.removeItem('containerAnswer')

    setTimeout(() => {
        navigateTo('/playing_field')
    }, 100)
    // getQuestions()
}

const getQuestions = async () => {
    const rounds = await store.getAllQuestions(store.globalRound())
    if (rounds && rounds.length > 0) round.value = rounds[0]
    console.log('roundVal', round.value)
}

onMounted(() => {
    getQuestions()
})
</script>

<style scoped lang="less">
@grid_gap: 20px;
.hidden_button {
    width: 5px;
    padding: 0;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;

    &:hover {
        width: 60px;
    }
}
.theme {
    &__wrapper {
        display: flex;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: @grid_gap;
        height: 100%;
        width: 100%;
    }

    &__row {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        align-items: center;
        gap: @grid_gap;
        height: 100%;
    }

    &__name {
        font-size: 20px;
        text-align: center;
    }
}
</style>
