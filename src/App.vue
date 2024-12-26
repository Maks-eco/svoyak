<template>
    <router-link to="/">
        <img class="logo__img" alt="logo" src="./assets/logo.jpg" />
    </router-link>
    <NuxtPage page-key="index" />
    <!-- <router-view /> -->
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #494949;
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
    /* filter: blur(1rem); */
}
</style>
