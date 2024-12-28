<template>
    <div class="theme__wrapper">
        <!-- <Transition> -->
        <div class="theme__list" v-if="round">
            <div
                class="theme__row"
                v-for="theme in round?.themes"
                :theme="theme.id"
            >
                <div class="theme__name">
                    {{ theme.name }}
                </div>
                <!-- <div> -->
                <OneQuestion
                    class="theme__question"
                    v-for="question in theme.questions"
                    :item="question"
                    :theme-id="theme.id"
                />
                <!-- </div> -->
            </div>
        </div>
        <!-- </Transition> -->
    </div>
    <!-- <router-view /> -->
</template>

<script lang="ts" setup>
import { ref, onUpdated, onMounted } from 'vue'
import type { Round } from '@/types/GameEntities'
import OneQuestion from './OneQuestion.vue'
import useCounterStore from '@/stores/storage'

const store = useCounterStore()

const props = defineProps({
    id: {
        required: false,
        type: String,
    },
})

const round = ref(null as Round | null)

const getQuestions = async () => {
    const rounds = await store.getAllQuestions()
    if (rounds && rounds.length > 0) round.value = rounds[0]
    console.log(round.value)
}

// const getCategory = async () => {
//     categories.value = props.id
//         ? await store.getCategoryData(props.id)
//         : await store.getCategoryData('0')
// }

// const categories = ref(null as Category[] | null)

// onUpdated(() => {
//     getCategory()
// })

onMounted(() => {
    getQuestions()
})
</script>

<style scoped lang="less">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
@grid_gap: 20px;
.theme {
    &__wrapper {
        display: flex;
        width: 100vw;
        height: 70vh;
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
    &__question {
    }

    &__name {
        font-size: 20px;
        text-align: center;
    }
}
</style>
