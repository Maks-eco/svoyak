<template>
    <div class="app__wrapper">
        <NuxtLink to="/" class="logo-link">
            <!-- <img class="logo__img" alt="logo" src="./assets/logo.jpg" /> -->
            Свояк
        </NuxtLink>
        <NuxtPage page-key="index" />
        <!-- <router-view /> -->
    </div>
</template>

<style lang="less">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #494949;
}
.logo-link {
    position: fixed;
    z-index: 1000;
    text-decoration: none;
    font-size: 20px;
    padding: 10px;
    margin: 5px;
    border-radius: 15px;
    background-color: @common-secondary-color;
    color: white;
    opacity: 0.75;
}
.logo__img {
    width: 200px;
    opacity: 0.85;
}

.page-enter-active,
.page-leave-active {
    transition: all 0.5s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
}
</style>
