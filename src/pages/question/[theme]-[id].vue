<template>
    <div class="question-viewer__wrapper">
        <div class="question-viewer__timer-row"></div>
        <div :class="{ hidden: !isImage }">
            <img
                class="question-viewer__big-image"
                alt="some"
                :src="location + img_on_page"
            />
        </div>
        <div :class="{ hidden: isImage }" class="question-viewer">
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
import type { Question } from '~/types/QuestionEntities'
import { useCounterStore } from '@/stores/storage'
import ControlButtons from '~/components/ControlButtons.vue'

import { timerEventEmitter, readText } from '@/script/question_page'

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
const isAnswered = ref(false)

const theme_id = ref('')
const questn_id = ref('')

const decreaseTimerBarWidth = (steps?: number) => {
    if (steps) timerBarWidth.value = steps.toString() + '%'
}

const getAnswer = () => {
    if (question.value) text_on_page.value = question.value.answer
    isAnswered.value = true
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

    timerEventEmitter(
        55,
        text_on_page.value.length,
        (st: any) => {
            finalText.value = readText(
                st,
                text_on_page.value,
                decreaseTimerBarWidth
            )
        },
        () => store.tapsInputWasStarted(question.value)
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
})
</script>

<style lang="less">
.highlighted {
    color: @common-highlighted-color;
}

.hidden {
    display: none;
}

.question-viewer {
    font-size: 40px;
    text-align: center;
    margin: auto 0;
    color: @text-primary-color;

    &__timer-row {
        height: 20px;
        border-radius: 10px;
        background-color: @support-primary-color;
        margin: 10px 0;
        width: v-bind(timerBarWidth);
        transition: width 0.2s linear;
    }

    &__wrapper {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 70%;
        width: 100%;
    }

    &__big-image {
        border-radius: 20px;
        height: 100%;
        width: 100%;
    }
}
</style>
