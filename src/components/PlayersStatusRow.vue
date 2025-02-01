<template>
    <div class="player__wrapper">
        <div class="player__item" v-for="player in players">
            <img
                class="player__image"
                alt="some"
                :src="location + player.image"
            />
            <p class="player__name">{{ player.name }}</p>
            <p class="player__points">{{ player.points }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Round } from '~/types/QuestionEntities'
import type { PlayersStatus } from '~/types/PlayerEntities'
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

    const bufarray: { allData: PlayersStatus[] } | null =
        await store.getPlayersData()
    if (bufarray?.allData) players.value = bufarray.allData

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
    }

    &__item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        border-radius: 12px;
        background-color: @gray-info-background-color;
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
        color: @text-primary-color;
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
