<template>
    <div class="big-text__wrapper">
        <div class="timer-row"></div>
        <div :class="{ hidden: !isImage }">
            <img class="big-image" alt="some" :src="location + img_on_page" />
        </div>
        <div :class="{ hidden: isImage }" class="big-text">
            <!-- {{ text_on_page }} -->
            <p v-html="finalText"></p>
        </div>
        <ControlButtons
            @getAnswer="getAnswer()"
            :itemId="questn_id"
            :themeId="theme_id"
        />
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
const finalText = ref('')
const timerBarWidth = ref('100%')
const db = store.db

const theme_id = ref('')
const questn_id = ref('')

const itsStarted = async () => {
    const gameState = await store.getGameState()
    console.log('gs', gameState)
    if (gameState?.idInBase && question.value) {
        const docRef = doc(db, 'game_state', gameState?.idInBase)
        const updateTimestamp = await updateDoc(docRef, {
            question_timestamp: serverTimestamp(),
            question_cost: question.value.cost,
            question_ask: question.value.ask,
            question_answer: question.value.answer,
        })
    } else {
        console.log('Not started!')
    }
}

const readText = (char: number) => {
    const cutSymbol = text_on_page.value.length - char
    const procSymbol = (char * 100) / text_on_page.value.length
    // console.log(char, procSymbol)
    decreaseTimer(procSymbol)
    finalText.value = `<span class="highlighted">${text_on_page.value.slice(
        0,
        cutSymbol
    )}</span>${text_on_page.value.slice(cutSymbol)}`
}

const Helllooo = () => {
    console.log('hello')
}
const decreaseTimer = (steps?: number) => {
    // console.log('s', steps)
    if (steps) timerBarWidth.value = steps.toString() + '%'
}
// let steps = 50
const itsTimer = async (
    stepPause: number,
    steps: number,
    callback: any,
    onEnd?: any
) => {
    callback(steps - 1)
    // console.log(steps)
    if (steps > 0) {
        setTimeout(async () => {
            await itsTimer(
                stepPause,
                steps - 1,
                (st: any) => {
                    callback(st)
                },
                () => {
                    onEnd()
                }
            )
        }, stepPause)
    } else {
        onEnd()
    }
}

const getAnswer = () => {
    if (question.value) text_on_page.value = question.value.answer
    console.log('aga')
    /*только для тестов!*/ //itsStarted()
}

onMounted(async () => {
    store.clearPlayersTapState()

    theme_id.value =
        typeof route.params.theme === 'string' ? route.params.theme : '0'
    questn_id.value =
        typeof route.params.id === 'string' ? route.params.id : '0'

    question.value = await store.getOneQuestion(
        parseInt(theme_id.value),
        parseInt(questn_id.value)
    )

    if (runtimeConfig.app?.baseURL && window.location?.origin)
        location.value = window.location.origin + runtimeConfig.app?.baseURL
    if (question.value) text_on_page.value = question.value.ask
    console.log('route', route, location.value)

    // itsTimer(
    //     50,
    //     100,
    //     (st: any) => decreaseTimer(st),
    //     () => Helllooo()
    // )

    itsTimer(
        55,
        text_on_page.value.length,
        (st: any) => readText(st),
        () => itsStarted()
    )
})

watch(text_on_page, async (newQuestion, oldQuestion) => {
    if (newQuestion.includes('image')) {
        isImage.value = true
        img_on_page.value = text_on_page.value
    } else {
        isImage.value = false
        finalText.value = text_on_page.value
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
.highlighted {
    color: #7958c2;
}
.hidden {
    display: none;
}
.timer-row {
    height: 30px;
    border-radius: 10px;
    background-color: #ff6960;
    margin: 10px 0;
    width: v-bind(timerBarWidth);
    transition: width 0.2s linear;
}
.big-text {
    font-size: 40px;
    text-align: center;
    margin: auto 0;
    color: #333;

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
