<template>
    <NuxtLink
        class="card__link-wrapper"
        :to="{
            name: 'question-theme-id',
            params: {
                id: item.id,
                theme: themeId,
            },
        }"
        :item="item"
    >
        <div class="card__block" :class="{ answered: isAnswered }">
            <p class="card__cost">{{ item.cost }}</p>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Question } from '~/types/QuestionEntities'
import { useCounterStore } from '@/stores/storage'

const isAnswered = ref(false)
const store = useCounterStore()

const props = defineProps({
    item: {
        required: true,
        type: Object as PropType<Question>,
    },
    themeId: {
        required: true,
        type: Number,
    },
})
onMounted(() => {
    isAnswered.value = store.getStatusThisQuestion(
        props.themeId.toString(),
        props.item.id.toString()
    )
})
</script>

<style scoped lang="less">
.card {
    &__link-wrapper {
        height: 100%;
        text-decoration: none;
    }

    &__block {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        border-radius: 20px;
        transition: background-color 0.3s;
        background-color: @common-secondary-color;

        &:hover {
            transition: background-color 0.3s;
            background-color: @common-primary-color;
        }
    }

    &__cost {
        margin: 5px;
        font-size: 24px;
        color: white; //#333;
        transition: color 0.4s;
    }
}
.card__block.answered {
    background-color: @inactive-background-color;

    .card__cost {
        color: @inactive-text-color;
    }
}
</style>
