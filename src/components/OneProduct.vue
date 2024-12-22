<template>
    <div class="product-contnr">
        <NuxtLink :to="{ name: 'product-id', params: { id: item.id } }">
            <div class="one-product">
                <div class="product__img-contnr">
                    <img
                        class="product__img"
                        alt="product"
                        v-bind="{ src: item.hdThumbnailUrl }"
                    />
                </div>
                <p class="product__name product-descr--transn">
                    {{ item.name }}
                </p>
                <div class="product__price-contnr product-descr--transn">
                    <p class="product__price">
                        <text class="product__price--small-text">Цена:</text>
                        {{ item.price.toFixed(2) }}
                    </p>
                </div>
            </div>
        </NuxtLink>
        <button class="buy-button" @click="saveToCart(item.id)">Купить</button>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Product } from '../types/Product'
import useCounterStore from '../stores/storage'

const store = useCounterStore()

defineProps({
    item: {
        required: true,
        type: Object as PropType<Product>,
    },
})

const saveToCart = (id: number) => {
    store.saveValue(id)
}
</script>

<style scoped>
a {
    text-decoration: none;
}
.product-contnr {
    margin-bottom: 90px;
}
.one-product {
    width: 250px;
    height: 280px;
    margin: 10px;
}
.product-descr--transn {
    color: #333;
    transition: color 0.4s;
}
.one-product:hover .product-descr--transn {
    color: #af66d4;
}
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
.product__name {
    margin: 5px;
    font-size: 18px;
    width: 80%;
    height: 42px;
    margin: 10px auto;
    overflow: hidden !important;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
.product__price {
    font-size: 17px;
    margin: 17px;
}
.product__price--small-text {
    font-size: 12px;
}
.product__img-contnr {
    width: 200px;
    height: 200px;
    overflow: hidden;
    margin: 0 auto;
}
.product__img {
    aspect-ratio: 1 / 1;
    width: 100%;
    object-fit: cover;
    transition: 0.5s all ease-in-out;
}
.one-product:hover .product__img {
    transform: scale(1.05);
}
</style>
