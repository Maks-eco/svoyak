<template>
    <div>BurningCoal</div>
    <div class="cart__img-container">
        <img class="cart__img" alt="cart" src="~/assets/coal_2.png" />
        <img
            class="cart__img cart__img--burned"
            alt="cart"
            src="~/assets/coal_1.png"
        />
    </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
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
.cart__img-container {
    position: relative;
    width: 700px;
}
.cart__img {
    position: absolute;
    margin-top: 20%;
    width: 60%;
    object-fit: cover;
    background-color: black;

    &--burned {
        opacity: 0.5;
        background-color: transparent;
        animation-duration: 1s;
        animation-name: slidein;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }
}
@keyframes slidein {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
