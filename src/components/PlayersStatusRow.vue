<template>
    <div class="player__wrapper">
        <!-- <div class="theme__list" v-if="round"> -->
        <div class="player__item" v-for="player in players">
            <!-- <div class="theme__name">
                {{ theme.name }}
            </div> -->
            <p class="player__name">{{ player.name }}</p>
            <p class="player__points">{{ player.points }}</p>
        </div>
        <!-- </div> -->
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Round } from '@/types/GameEntities'
import OneQuestion from './OneQuestion.vue'
import useCounterStore from '@/stores/storage'

const store = useCounterStore()

const round = ref(null as Round | null)
const players = ref(
    {} as { id: string; name: string; points: number; image: string }[]
)

const getQuestions = async () => {
    const rounds = await store.getAllQuestions()
    if (rounds && rounds.length > 0) round.value = rounds[0]
    console.log(round.value)
}

onMounted(() => {
    getQuestions()
    players.value = useCounterStore().playersStatus
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
        height: 20vh;
    }

    &__item {
        flex: 1;
        display: flex;
        flex-direction: column;
        // grid-template-columns: repeat(6, 1fr);
        align-items: center;
        gap: @grid_gap;
        height: 100%;
        border-radius: 12px;
        background-color: greenyellow;
    }

    &__name {
        font-size: 20px;
        text-align: center;
    }
}
</style>
