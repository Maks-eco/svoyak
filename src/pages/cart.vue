<template>
    <div class="product-contnr">
        <h1 class="">Список покупок</h1>
        <button
            class="cart-button cart-button--order-compl"
            @click="triggerOrder()"
            v-if="products && products.length > 0"
        >
            Оформить
        </button>
        <p v-else>Ваша корзина пуста</p>
    </div>
    <!-- <BurningCoal /> -->
    <OrderCompletionMessage v-if="showButton" @closeWindow="triggerOrder()" />
    <div v-if="products">
        <div class="product-contnr" v-for="item in products" :key="item.id">
            <div class="one-product">
                <div class="product__img-contnr">
                    <img
                        class="product__one-img"
                        alt="product preview"
                        v-bind:src="item.hdThumbnailUrl"
                    />
                </div>
                <div class="product__descr">
                    <p class="product__descr-name">{{ item.name }}</p>
                    <p class="product__descr-name">
                        Количество: {{ item.count }}
                    </p>
                    <button
                        class="cart-button cart-button--delete-product"
                        @click="deleteProduct(item.id)"
                    >
                        Удалить
                    </button>
                </div>
            </div>
            <hr class="under-product" />
        </div>
    </div>
    <metainfo />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Product } from '../types/Product'
import OrderCompletionMessage from '../components/OrderCompletionMessage.vue'
import useCounterStore from '../stores/storage'
import BurningCoal from '~/components/BurningCoal.vue'
// import { useMeta } from 'vue-meta'

// useMeta({
//   title: 'Cart'
// })

const store = useCounterStore()

interface ProductCount extends Product {
    count?: number
}

const getProductsInCartWithCount = async (): Promise<ProductCount[] | null> => {
    const arrayIds = store.getValue
    if (!productList.value) productList.value = await store.getProductData()
    if (productList.value) {
        const filteredData: ProductCount[] = productList.value
            .map((item) => {
                return {
                    ...item,
                    ...arrayIds.filter((chunk) => chunk.id === item.id)[0],
                }
            })
            .filter((item) => item.count)
        return filteredData
    }
    return null
}

const productList = ref(null as Product[] | null)
const products = ref(null as ProductCount[] | null)
const showButton = ref(false)

const deleteProduct = async (id: number) => {
    store.deleteItem(id)
    products.value = await getProductsInCartWithCount()
}
const triggerOrder = () => {
    showButton.value = !showButton.value
    return showButton
}

onMounted(() => {
    getProductsInCartWithCount().then((data) => {
        products.value = data
    })
})
</script>

<style scoped>
.product-contnr {
    width: 400px;
    margin-bottom: 13px;
}
@media (min-width: 750px) {
    .product-contnr {
        margin-left: 80px;
        margin-bottom: 30px;
    }
}
.product__descr {
    text-align: right;
    width: 280px;
}
@media (max-width: 750px) {
    .product-contnr {
        margin: 30px auto;
    }
    .product__descr {
        text-align: right;
        width: 280px;
    }
}
@media (max-width: 480px) {
    .product-contnr {
        width: 100%;
    }
    .one-product {
        flex-wrap: wrap;
    }
    .product__descr {
        text-align: left;
        width: 100%;
    }
}
.one-product {
    justify-content: space-between;
    width: 100%;
    display: flex;
}
.cart-button {
    background-color: #444;
    border: none;
    color: white;
    padding: 8px 20px;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    transition: background-color 0.2s;
}
.cart-button--delete-product:hover {
    background-color: #fd3f49;
}
.cart-button--order-compl:hover {
    background-color: #af66d4;
}
.product__img-contnr {
    width: 100px;
    height: 100px;
    margin-top: auto;
}
.product__one-img {
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.under-product {
    width: 95%;
}
.product__descr-name {
    margin: 7px 0px;
}
</style>
