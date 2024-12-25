<template>
    <div>
        <NuxtLink to="/cart">
            <div class="contol__wrapper">
                <button class="contol__show-answer">Ответ</button>
                <button class="contol__show-menu">Меню</button>
            </div>
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
import useCounterStore from '../stores/storage'

const numberOfPurchases = useCounterStore()
</script>

<style scoped>
.contol__wrapper {
    position: fixed;
    right: 0;
    bottom: 0;
}
</style>
