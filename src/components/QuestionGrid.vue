<template>
    <div class="theme__wrapper" :key="roundKey">
        <div class="theme__row-list" v-if="round" :key="questionsKey">
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
        <button class="next-round__button" @click="nextRound()">
            Next round
        </button>
        <button class="clear-round__button" @click="clearRound()">
            Clear round
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Round, Theme } from '~/types/QuestionEntities'
import OneQuestion from './OneQuestionCard.vue'
import { useCounterStore, locStorage } from '@/stores/storage'

const store = useCounterStore()

const round = ref(null as Round | null)
const numberOfColumns = ref(1)
const questionsKey = ref(0)
const roundKey = ref(0)

const nextRound = () => {
    console.log('rv', round.value?.id)
    store.globalRound(round.value?.id)
    locStorage.removeData('containerAnswer')

    getQuestions()
    roundKey.value++
}

const clearRound = () => {
    locStorage.removeData('containerAnswer')
    questionsKey.value++
}

const getQuestions = async () => {
    const rounds = await store.getAllQuestions(store.globalRound())
    if (rounds && rounds.length > 0) {
        round.value = rounds[0]
        round.value.themes.forEach((theme: Theme) => {
            let maxQuestionInRowCount = 0
            theme.questions.forEach(() => maxQuestionInRowCount++)
            if (numberOfColumns.value < maxQuestionInRowCount)
                numberOfColumns.value = maxQuestionInRowCount
        })
    }
    console.log('roundVal', round.value)
}

onMounted(() => {
    getQuestions()
})
</script>

<style scoped lang="less">
@grid_gap: 20px;

.next-round__button,
.clear-round__button {
    width: 5px;
    padding: 0;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;

    &:hover {
        width: 60px;
    }
}

.clear-round__button {
    bottom: 50px;
}

.theme {
    &__wrapper {
        display: flex;
    }

    &__row-list {
        display: flex;
        flex-direction: column;
        gap: @grid_gap;
        height: 100%;
        width: 100%;
    }

    &__row {
        display: grid;
        grid-template-columns: repeat(calc(v-bind('numberOfColumns') + 1), 1fr);
        align-items: center;
        gap: @grid_gap;
        height: 100%;
    }

    &__name {
        color: @text-primary-color;
        font-size: 20px;
        font-weight: 500;
        text-align: center;
    }
}
</style>
