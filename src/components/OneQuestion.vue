<template>
    <NuxtLink
        :to="{
            name: 'question-theme-id',
            params: {
                id: item.id,
                theme: themeId,
            },
        }"
        :item="item"
    >
        <div class="one-section">
            <p class="section__descr">{{ item.cost }}</p>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Question } from '@/types/GameEntities'

defineProps({
    item: {
        required: true,
        type: Object as PropType<Question>,
    },
    themeId: {
        required: true,
        type: Number,
    },
})
</script>

<style scoped>
a {
    height: 100%;
    text-decoration: none;
}

.one-section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border-radius: 20px;
    transition: background-color 0.3s;
    background-color: greenyellow;

    &:hover {
        transition: background-color 0.3s;
        background-color: khaki;
    }
}
.section__descr {
    margin: 5px;
    font-size: 24px;
    color: #333;
    transition: color 0.4s;
}
</style>
