<template>
    <div>
        <br /><br /><br />
        <p>{{ question_ask }}</p>
        <p class="question__answer">{{ question_answer }}</p>
        <p>{{ questionCost }}</p>
        <div class="panel__divider">
            <div>
                <div
                    class="answer__item"
                    v-for="answer in answerList"
                    :key="answer.ts"
                    :class="{
                        first: answer.first,
                        'false-start': answer.sign < 0,
                    }"
                >
                    <div>
                        {{ answer.name }}: {{ answer.converted }} (
                        {{ answer.center }})
                    </div>
                </div>
            </div>
            <div class="players__wrapper">
                <div
                    class="players__item"
                    v-for="player in playersStatus"
                    :key="player.id"
                >
                    <!-- <div> -->
                    <span class="player__name">{{ player.name }}</span
                    >: {{ player.points }}
                    <input
                        class="points__input"
                        type="number"
                        maxlength="6"
                        v-model="player.ref"
                    /><button
                        class="player__button-add"
                        @click="
                            changeStat(
                                playersStatus,
                                player.id,
                                player.ref,
                                saveStatus
                            )
                        "
                    >
                        Add
                    </button>
                    <button
                        class="player__button-delete"
                        @click="
                            changeStat(
                                playersStatus,
                                player.id,
                                -player.ref,
                                saveStatus
                            )
                        "
                    >
                        Отжать
                    </button>
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useCounterStore from '@/stores/storage'
import type { PlayersStatus } from '@/types/GameEntities'
import { addVisualisationProps, changeStat } from '@/script/admin_panel'

const store = useCounterStore()
const tapsState = ref('')
const ratedState = ref('')
const questionCost = ref(0)
const question_ask = ref('')
const question_answer = ref('')
// const ratedState = ref('')
const answerList = ref([] as any[])
const playersStatus = ref([] as PlayersStatusAndRef[] | null)
let ddd: any

type PlayersStatusAndRef = Partial<PlayersStatus> & {
    ref: number
}

const saveStatus = (array: PlayersStatus[]) => {
    console.log('savethis', array)
    store.setPlayersData(array).then(() => {
        getPlayersData()
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
    }, 2000)
})
// getPlayersTapState
</script>

<style scoped>
.question__answer {
    font-weight: bold;
}
.players__wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.player__name {
    font-weight: bold;
}
.players__item {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 3px;
    border-radius: 5px;
    transition: background-color 0.7s;

    &:hover {
        background-color: rgba(0, 0, 255, 0.158);
        transition: background-color 0.3s;
    }
}
.points__input {
    width: 60px;
}
.player__button-add,
.player__button-delete {
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: bold;
}
.player__button-add {
    background-color: rgb(50, 187, 50);
}
.player__button-delete {
    background-color: rgb(255, 77, 77);
}
.panel__divider {
    display: flex;
}
.answer__item {
    color: gray;
    font-weight: bold;
}
.first {
    background-color: rgb(29, 133, 8);
}
.false-start {
    color: rgb(126, 85, 32);
}
.first,
.first.false-start {
    /* background-color: red; */
    color: white;
    width: fit-content;
    border-radius: 12px;
    padding: 3px 15px;
}
.first.false-start {
    background-color: red;
}
</style>
