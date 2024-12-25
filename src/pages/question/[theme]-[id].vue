<template>
    <Transition>
        <div class="big-text__wrapper">
            <div><div v-html="img_on_page"></div></div>
            <img class="big-image" alt="some" :src="location + img_on_page" />
            <!-- v-bind="{ src: '@/' + img_on_page }" -->
            <div class="big-text">{{ text_on_page }}</div>
            <ControlButtons @getAnswer="getAnswer()" />
            {{ isImage }}
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import type { Question } from '@/types/GameEntities'
import useCounterStore from '@/stores/storage'
import ControlButtons from '~/components/ControlButtons.vue'

const runtimeConfig = useRuntimeConfig()

// console.log(runtimeConfig.app.baseURL)

const store = useCounterStore()

const route = useRoute()

const question = ref(null as Question | null)

const isImage = ref(false)

const text_on_page = ref('' as string)
const img_on_page = ref('' as string)
const location = ref('' as string)

const getAnswer = () => {
    if (question.value) text_on_page.value = question.value.answer
    console.log('aga')
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
})

watch(text_on_page, async (newQuestion, oldQuestion) => {
    if (newQuestion.includes('image')) {
        isImage.value = true
        img_on_page.value = text_on_page.value
        console.log('i watch', img_on_page.value)
    }
    isImage.value = false
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
.big-text {
    font-size: 40px;
    text-align: center;
    margin: auto 0;

    &__wrapper {
        position: fixed;
        display: flex;
        justify-content: center;
        height: 70%; //calc(100% - 500px);;
        width: 100%;
    }
}
.big-image {
    border-radius: 20px;
}
</style>
