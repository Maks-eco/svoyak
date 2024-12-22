<template>
  <div class="category-contnr">
    <Transition>
      <div class="category-list" v-if="categories">
        <div v-for="item in categories" :key="item.id">
          <OneCategory :item="item" />
        </div>
      </div>
    </Transition>
  </div>
  <router-view />
</template>

<script lang="ts" setup>
import { ref, onUpdated, onMounted } from 'vue'
import type { Category } from '@/types/Category'
import OneCategory from './OneCategory.vue'
import useCounterStore from '@/stores/storage'

const store = useCounterStore()

const props = defineProps({
  id: {
    required: false,
    type: String,
  },
})

const getCategory = async () => {
  categories.value = props.id
    ? await store.getCategoryData(props.id)
    : await store.getCategoryData('0')
}

const categories = ref(null as Category[] | null)

onUpdated(() => {
  getCategory()
})

onMounted(() => {
  getCategory()
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.category-contnr {
  display: flex;
  justify-content: center;
  text-align: center;
}
.category-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
@media (min-width: 1024px) {
  .category-list {
    width: 860px;
  }
}
@media (max-width: 1024px) {
  .category-list {
    width: 80%;
  }
}
</style>
