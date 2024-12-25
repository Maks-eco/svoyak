<template>
    <!-- <CategoryList :id="id" />
  <ProductList /> -->
    I am question!
    <p class="big-text">{{ question?.ask }}</p>
    <!-- {{ item.description }} -->
    <!-- <metainfo /> -->
    <ControlButtons />
</template>

<script lang="ts" setup>
import type { Question } from '@/types/GameEntities'
import useCounterStore from '@/stores/storage'
import ControlButtons from '~/components/ControlButtons.vue'

const store = useCounterStore()
// import CategoryList from '~/components/QuestionGrid.vue'
// import ProductList from '@/components/ProductList.vue'
// import { useMeta } from 'vue-meta'

// useMeta({
//   title: 'Catalog',
// })

const route = useRoute()

const question = ref(null as Question | null)
// When accessing /posts/1, route.params.id will be 1

// const props = defineProps({
//     item: {
//         required: true,
//         type: Object as PropType<Question>,
//     },
// })

onMounted(async () => {
    const theme_id: string =
        typeof route.params.theme === 'string' ? route.params.theme : '0'
    const questn_id: string =
        typeof route.params.id === 'string' ? route.params.id : '0'

    question.value = await store.getOneQuestion(
        parseInt(theme_id),
        parseInt(questn_id)
    )
    console.log('ro', route.params, question.value)
})
</script>

<style lang="less">
.big-text {
    font-size: 40px;
}
</style>
