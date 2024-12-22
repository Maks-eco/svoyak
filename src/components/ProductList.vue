<template>
  <CartButton />
  <Transition>
    <p class="warn-msg" v-if="products && products.length == 0">
      Товары пока не добавлены в эту категорию
    </p>
  </Transition>
  <div class="product-list__contnr">
    <Transition>
      <div class="product-list" v-if="products && isRenderedProd">
        <div v-for="item in products" :key="item.id">
          <OneProduct :item="item" />
        </div>
      </div>
    </Transition>
  </div>
  <div ref="observe" class="observer"></div>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref } from 'vue'
import type { Product } from '../types/Product'
import OneProduct from './OneProduct.vue'
import CartButton from './CartButton.vue'
import { useRoute } from 'vue-router'
import useCounterStore from '@/stores/storage'

const store = useCounterStore()

const route = useRoute()

const updateProducts = async (routeIds: string, page: number) => {
  if (routeIds === '0') return await store.getAllProduct(page)
  return await store.getProductDataByCategoryId(page, routeIds)
}

const products = ref(null as Product[] | null)
const isRenderedProd = ref(false)
const observe = ref(null as Element | null)
const observer = ref(null as IntersectionObserver | null)
const page = ref(1)
const mountedElem = ref(0)

watch(
  [() => route.params.id, () => mountedElem.value],
  () => {
    page.value = 1
    products.value = null
    isRenderedProd.value = false

    let categoryId: string = '0'

    if (route?.params?.id) {
      categoryId =
        typeof route.params.id === 'string'
          ? (route.params.id as string)
          : (route.params.id[0] as string)
    }

    if (observe.value) {
      let options = {
        rootMargin: '0px',
        threshold: 1.0,
      }

      let callback = (entries: any, observer: any) => {
        if (entries[0].isIntersecting) {
          updateProducts(categoryId, page.value).then((data) => {
            if (data) {
              if (products.value) {
                products.value = [...products.value, ...data]
              } else {
                products.value = data
              }
            }
            isRenderedProd.value = true
            page.value += 1
          })
        }
      }
      if (observe.value && !observer.value) {
        observer.value = new IntersectionObserver(callback, options)
        observer.value.observe(observe.value)
      }
    }
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  isRenderedProd.value = true
  mountedElem.value += 1
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
.product-list__contnr {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}
.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
@media (min-width: 1024px) {
  .product-list {
    width: 860px;
  }
}
@media (max-width: 1024px) {
  .product-list {
    width: 80%;
  }
}
.warn-msg {
  text-align: center;
}
.observer {
  height: 50px;
}
</style>
