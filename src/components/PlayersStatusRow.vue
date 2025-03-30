<template>
    <div class="player__wrapper">
        <div class="player__item" v-for="player in players">
            <div class="player__image-wrapper">
                <img
                    class="player__image"
                    alt="some"
                    :src="location + player.image"
                />
                <div class="player__image-background"></div>
            </div>
            <p class="player__name">{{ player.name }}</p>
            <p class="player__points">{{ player.points }}</p>
            <DeletePlayerButton
                class="player__delete"
                @approved-deletion="deletePlayer(player.id)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Round } from '~/types/QuestionEntities'
import type { PlayersStatus } from '~/types/PlayerEntities'
import { useCounterStore } from '@/stores/storage'
const runtimeConfig = useRuntimeConfig()
const location = ref('')

const store = useCounterStore()

const round = ref(null as Round | null)
const players = ref(null as PlayersStatus[] | null)

const getQuestions = async () => {
    const rounds = await store.getAllQuestions()
    if (rounds && rounds.length > 0) round.value = rounds[0]
}

const deletePlayer = async (player_id: string) => {
    await store.deleteUser(player_id)

    const bufarray: { allData: PlayersStatus[] } | null =
        await store.getPlayersData()
    if (bufarray?.allData) players.value = bufarray.allData
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
            'images/looks/'
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
        position: relative;
        height: 100%;
        border-radius: 12px;
        background-color: @gray-info-background-color;
    }
    &__image-wrapper {
        position: relative;
        top: -20px;
        height: calc(100% - 75px);
        object-fit: cover;
    }
    &__image {
        position: relative;
        height: 100%;
        border-radius: 12px;
        z-index: 15;
    }

    &__image-background {
        position: absolute;
        left: 50%;
        top: 50%;
        height: 110px;
        width: 110px;
        background-color: white;
        border-radius: 1000px;
        z-index: 10;
        transform: translate(-50%, -50%);
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

    &__delete {
        position: absolute;
        bottom: 0;
        right: 0;
    }
}
</style>
