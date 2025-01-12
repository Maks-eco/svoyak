<template>
    <div>
        <br /><br /><br />
        <div class="question-info">
            <p>{{ question_ask }}</p>
            <p class="question-info__answer">Ответ: {{ question_answer }}</p>
            <p>Стоимость: {{ questionCost }}</p>
        </div>
        <div class="panel__divider">
            <div class="answer__items-wrapper">
                Очередность:
                <div
                    class="answer__item"
                    v-for="answer in answerList"
                    :key="answer.ts"
                    :class="{
                        answer__first: answer.first,
                        'answer__false-start': answer.sign < 0,
                    }"
                >
                    <div>
                        {{ answer.name }}: {{ answer.converted }} (
                        {{ answer.center }})
                    </div>
                </div>
            </div>
            <AdminPointsControls
                :playersStatus="playersStatus"
                @saveStatus="(id, cost) => saveStatus(id, cost)"
            />
            <!-- <IconsSet /> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import useCounterStore from '@/stores/storage'
import type { PlayersStatus, PlayersStatusAndRef } from '~/types/PlayerEntities'
import { addVisualisationProps, changeStat } from '@/script/admin_panel'
// import IconsSet from '~/components/IconsSet.vue'

const store = useCounterStore()
const tapsState = ref('')
const questionCost = ref(0)
const question_ask = ref('')
const question_answer = ref('')
const answerList = ref([] as any[])
const playersStatus = ref([] as PlayersStatusAndRef[] | null)
let ddd: any

const saveStatus = (id: any, cost: any) => {
    changeStat(playersStatus.value, id, cost, (array: PlayersStatus[]) => {
        console.log('savethis', array)
        store.setPlayersData(array).then(() => {
            getPlayersData()
        })
    })
}

const getPlayersData = async () => {
    store.getGameState().then((info) => {
        playersStatus.value = []
        if (info) {
            const bufarray: PlayersStatus[] = info.allData.data

            questionCost.value = info.allData.question_cost
            question_ask.value = info.allData.question_ask
            question_answer.value = info.allData.question_answer

            bufarray.forEach((bufitem) => {
                playersStatus.value?.push({
                    ...bufitem,
                    ref: info.allData.question_cost,
                })
            })
            console.log('pv', bufarray, playersStatus.value)
        }
    })
}

onMounted(async () => {
    getPlayersData()

    setInterval(async () => {
        ;({ string: tapsState.value, centered: ddd } =
            await store.getPlayersTapState())

        answerList.value = addVisualisationProps(ddd)
        getPlayersData()
    }, 6000) //2000
})
</script>

<style scoped lang="less">
.question-info {
    margin: 5px;
    padding: 5px;
    border: 2px solid #ddd;
    border-radius: 12px;

    &__answer {
        font-weight: bold;
    }
}
.panel__divider {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
}
.answer {
    &__items-wrapper {
        @media (max-width: 800px) {
            order: 2;
        }
    }

    &__item {
        color: @inactive-text-color;
        font-weight: bold;
    }

    &__first {
        background-color: rgb(29, 133, 8);
    }

    &__false-start {
        color: rgb(126, 85, 32);
    }

    &__first,
    &__first.answer__false-start {
        color: white;
        width: fit-content;
        border-radius: 12px;
        padding: 3px 15px;
    }

    &__first.answer__false-start {
        background-color: red;
    }
}
</style>
