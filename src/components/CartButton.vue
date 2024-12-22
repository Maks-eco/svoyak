<template>
  <div>
    <NuxtLink to="/cart">
      <div class="cart">
        <img class="cart__img" alt="cart" src="../assets/1396q90627.jpg" />
        <div
          class="cart-counter__contnr"
          v-if="numberOfPurchases.getCountItems > 0"
        >
          <p class="cart-counter__text">
            {{
              parseInt(numberOfPurchases.getCountItems.toString(), 10) < 100
                ? numberOfPurchases.getCountItems
                : '99+'
            }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import useCounterStore from '../stores/storage'

const numberOfPurchases = useCounterStore()
</script>

<style scoped>
.cart {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 70px;
  height: 70px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 3px 3px 2px #c4c4c4;
  border: solid #ebebeb;
  border-width: 1px;
  text-align: center;
}
.cart__img {
  margin-top: 20%;
  width: 60%;
  object-fit: cover;
  opacity: 0.85;
}
.cart-counter__contnr {
  left: 45px;
  bottom: 15px;
  position: relative;
  background-color: #7409aa;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cart-counter__text {
  font-weight: bold;
  font-size: 20px;
  color: #fff;
}
</style>
