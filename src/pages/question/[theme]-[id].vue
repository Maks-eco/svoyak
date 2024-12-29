<template>
    <div class="big-text__wrapper">
        <div class="timer-row"></div>
        <div :class="{ hidden: !isImage }">
            <img class="big-image" alt="some" :src="location + img_on_page" />
        </div>
        <div :class="{ hidden: isImage }" class="big-text">
            {{ text_on_page }}
        </div>
        <ControlButtons @getAnswer="getAnswer()" />
    </div>
</template>

<script lang="ts" setup>
import type { Question } from '@/types/GameEntities'
import useCounterStore from '@/stores/storage'
import ControlButtons from '~/components/ControlButtons.vue'

import { serverTimestamp, updateDoc, doc } from 'firebase/firestore'

const runtimeConfig = useRuntimeConfig()
const store = useCounterStore()
const route = useRoute()
const question = ref(null as Question | null)
const isImage = ref(false)
const text_on_page = ref('' as string)
const img_on_page = ref('' as string)
const location = ref('' as string)
const timerBarWidth = ref('100%')
const db = store.db

const itsStarted = async () => {
    const gameState = await store.getGameState()
    console.log('gs', gameState)
    const docRef = doc(db, 'game_state', gameState.id)
    const updateTimestamp = await updateDoc(docRef, {
        question_timestamp: serverTimestamp(),
    })
}
let steps = 50
const itsTimer = async () => {
    timerBarWidth.value = (steps * 2).toString() + '%'
    steps -= 1
    console.log(steps)
    if (steps >= 0) {
        setTimeout(async () => {
            await itsTimer()
        }, 100)
    }
}

const getAnswer = () => {
    if (question.value) text_on_page.value = question.value.answer
    console.log('aga')
    /*только для тестов!*/ itsStarted()
}

onMounted(async () => {
    const theme_id: string =
        typeof route.params.theme === 'string' ? route.params.theme : '0'
    const questn_id: string =
        typeof route.params.id === 'string' ? route.params.id : '0'

    question.value = await store.getOneQuestion(
        parseInt(theme_id),
        parseInt(questn_id)
    )

    if (runtimeConfig.app?.baseURL && window.location?.origin)
        location.value = window.location.origin + runtimeConfig.app?.baseURL
    if (question.value) text_on_page.value = question.value.ask
    console.log('route', route, location.value)

    // setInterval(async () => {
    // itsStarted()
    // console.log('upd_question_tap')
    // }, 3000)
    itsTimer()
})

watch(text_on_page, async (newQuestion, oldQuestion) => {
    if (newQuestion.includes('image')) {
        isImage.value = true
        img_on_page.value = text_on_page.value
    } else {
        isImage.value = false
    }

    console.log('i watch', isImage.value)
})
</script>

<style lang="less">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
.hidden {
    display: none;
}
.timer-row {
    height: 20px;
    background-color: blue;
    padding: 20px 0;
    width: v-bind(timerBarWidth);
    transition: width 0.2s linear;
}
.big-text {
    font-size: 40px;
    text-align: center;
    margin: auto 0;

    &__wrapper {
        position: fixed;
        display: flex;
        // justify-content: center;
        flex-direction: column;
        align-items: center;
        height: 70%;
        width: 100%;
    }
}
.big-image {
    border-radius: 20px;
    height: 100%;
    width: 100%;
}
</style>
