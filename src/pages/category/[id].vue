<template>
  <CategoryList :id="id" />
  <ProductList />
  <metainfo />
</template>

<script lang="ts" setup>
import CategoryList from '@/components/CategoryList.vue'
import ProductList from '@/components/ProductList.vue'
// import { useMeta } from 'vue-meta'

// useMeta({
//   title: 'Catalog',
// })

defineProps({
  id: {
    required: true,
    type: String,
  },
})
</script>
