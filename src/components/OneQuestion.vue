<template>
    <NuxtLink
        :to="{
            name: 'question-theme-id',
            params: {
                id: item.id,
                theme: themeId,
            },
        }"
        :item="item"
    >
        <div class="one-section" :class="{ answered: isAnswered }">
            <p class="section__descr">{{ item.cost }}</p>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Question } from '@/types/GameEntities'
import useCounterStore from '@/stores/storage'

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
a {
    height: 100%;
    text-decoration: none;
}

.one-section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border-radius: 20px;
    transition: background-color 0.3s;
    background-color: #67568c;

    &:hover {
        transition: background-color 0.3s;
        background-color: #50426c;
    }
}
.one-section.answered {
    background-color: rgba(233, 233, 233, 0.46);
    .section__descr {
        color: #c5c5c5;
    }
}
.section__descr {
    margin: 5px;
    font-size: 24px;
    color: white; //#333;
    transition: color 0.4s;
}
</style>
