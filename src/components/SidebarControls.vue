<template>
    <div class="super-setting__container" :class="{ open: isSettingsOpen }">
        <slot></slot>
        <div @click="toggleSettings()" class="super-setting__toggle">
            <img
                class="super-setting__close-icon"
                alt="some"
                src="@/public/mecha_star.svg"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const isSettingsOpen = ref(false)

const toggleSettings = () => {
    isSettingsOpen.value = !isSettingsOpen.value
}
</script>

<style lang="less">
.super-setting {
    &__container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 300px;
        height: 50vh;
        padding: 16px;
        box-sizing: border-box;
        background-color: @common-primary-color;
        transform: translateX(-300px);
        transition: transform 0.3s ease;
        z-index: 110;

        &::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            height: inherit;
            width: inherit;
            border-radius: 0 12px 0 0;
            background-color: white;
            transform: translate(-3px, 3px);
            z-index: -10;
        }
    }
    &__container.open {
        transform: translateX(0px);
        transition: transform 0.3s ease;
    }
    @toggle-background: @common-primary-color;
    &__toggle {
        position: absolute;
        height: 40px;
        top: 0;
        right: -50px;
        padding: 10px;
        border-radius: 12px;
        background-color: @toggle-background;
        cursor: pointer;
        user-select: none;
        z-index: -20;

        &::after {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            bottom: -20px;
            border-style: solid;
            border-width: 20px 50px 0 0;
            border-color: @toggle-background transparent transparent transparent;
        }
    }
    &__close-icon {
        height: 40px;
        filter: invert(1);
    }
}
.logout-button {
    position: relative;
}
</style>
