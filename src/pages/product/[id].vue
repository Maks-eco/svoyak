<template>
    <CartButton />
    <div class="product-contnr">
        <div class="one-product" v-if="productData">
            <div class="product__img-contnr">
                <img
                    class="product__one-img"
                    alt="product"
                    v-bind="{
                        src: '~/' + productData.hdThumbnailUrl,
                    }"
                />
            </div>
            <div class="product__descr-contnr">
                <h1 class="product__descr-name">{{ productData.name }}</h1>
                <p v-html="productData.description"></p>
                <h4>Стоимость: {{ productData.price }}</h4>
                <button class="buy-button" @click="saveToCart(id)">
                    Купить
                </button>
            </div>
        </div>
        <p v-else>{{ loadStatus }}</p>
    </div>
    <metainfo />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import type { Product } from '@/types/Product'
import CartButton from '@/components/CartButton.vue'
import useCounterStore from '@/stores/storage'
// import { useMeta } from 'vue-meta'

const store = useCounterStore()
const route = useRoute()
let pageId = ''
if (typeof route.params.id === 'string') {
    pageId = route.params.id
}
const props = defineProps({
    id: {
        required: true,
        type: String,
    },
})

let pageName = ref('Product' as string)
const productData = ref(null as Product | null)
const loadStatus = ref('Загрузка описания товара...' as string)

// useMeta(
//   computed(() => ({
//     title: pageName.value
//   }))
// )

onMounted(async () => {
    const data = await store.getProductDataById(pageId)
    if (data?.name) {
        productData.value = data
    } else {
        loadStatus.value = 'Описание товара не найдено'
    }
})

watch(
    () => productData.value,
    () => {
        if (productData.value?.name) {
            pageName.value = productData.value?.name
        }
    },
    { deep: true, immediate: true }
)

const saveToCart = (id: string) => {
    const idValue = parseInt(id, 10)
    store.saveValue(idValue)
}
</script>

<style scoped>
.buy-button {
    background-color: #444;
    border: none;
    color: white;
    padding: 8px 20px;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    transition: background-color 0.2s;
}
.buy-button:hover {
    background-color: #af66d4;
}
.one-product {
    margin-top: 30px;
    width: 860px;
    display: flex;
    flex-wrap: wrap;
}
.product-contnr {
    display: flex;
    justify-content: center;
    width: 80%;
    margin: 0px auto;
}
.product__one-img {
    width: 100%;
}
@media (min-width: 480px) {
    .product__img-contnr {
        width: 35%;
        min-width: 150px;
    }
    .product__descr-contnr {
        margin-left: 5%;
        width: 60%;
    }
}
@media (max-width: 780px) {
    .product-contnr {
        width: 100%;
    }
}
@media (max-width: 480px) {
    .product__img-contnr {
        width: 100%;
        min-width: 200px;
    }
    .product__descr-contnr {
        width: 100%;
    }
}
.product__descr-name {
    margin-top: 0px;
}
</style>
