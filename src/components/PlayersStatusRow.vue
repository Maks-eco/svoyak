<template>
    <div class="player__wrapper">
        <!-- <div class="theme__list" v-if="round"> -->
        <div class="player__item" v-for="player in players">
            <!-- <div class="theme__name">
                {{ theme.name }}
            </div> -->
            <img
                class="player__image"
                alt="some"
                :src="location + player.image"
            />
            <p class="player__name">{{ player.name }}</p>
            <p class="player__points">{{ player.points }}</p>
        </div>
        <!-- </div> -->
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Round, PlayersStatus } from '@/types/GameEntities'
import OneQuestion from './OneQuestion.vue'
import useCounterStore from '@/stores/storage'
const runtimeConfig = useRuntimeConfig()
const location = ref('')

const store = useCounterStore()

const round = ref(null as Round | null)
const players = ref(null as PlayersStatus[] | null)

const getQuestions = async () => {
    const rounds = await store.getAllQuestions()
    if (rounds && rounds.length > 0) round.value = rounds[0]
    console.log(round.value)
}

onMounted(async () => {
    getQuestions()
    // const dataGame = await store.getGameState()
    // if (dataGame) {
    //     players.value = dataGame.data
    //     console.log('pv', players.value)
    // }

    store.getGameState().then((info) => {
        if (info) {
            players.value = info.allData.data
            console.log('pv', info.allData)
        }
    })

    if (runtimeConfig.app?.baseURL && window.location?.origin)
        location.value =
            window.location.origin +
            runtimeConfig.app?.baseURL +
            'images/players/'
})
</script>

<style scoped lang="less">
@grid_gap: 20px;

.player {
    &__wrapper {
        display: flex;
        justify-content: space-around;
        gap: 20px;
        // flex-direction: row;
        width: 100vw;
        height: 30vh;
    }

    &__item {
        flex: 1;
        display: flex;
        flex-direction: column;
        // grid-template-columns: repeat(6, 1fr);
        align-items: center;
        // gap: @grid_gap;
        height: 100%;
        border-radius: 12px;
        background-color: greenyellow;
    }

    &__image {
        width: 100%;
        height: calc(100% - 75px);
        object-fit: cover;
        border-radius: 12px;
    }
    &__name,
    &__points {
        margin: 0;
    }
    &__name {
        font-size: 20px;
        text-align: center;
    }

    &__points {
        font-weight: bold;
        font-size: 32px;
    }
}
</style>
