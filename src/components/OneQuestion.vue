<template>
    <!-- <div class="section-contnr"> -->
    <!-- <router-link :to="{ name: 'CategoryView', params: { id: item.id } }"> -->
    <NuxtLink
        :to="{
            name: 'question-theme-id',
            params: {
                // id: `${themeId}-${item.id}`,
                // question: item.id,
                id: item.id,
                theme: themeId,
            },
        }"
        :item="item"
    >
        <div class="one-section">
            <!-- I am link to question -->
            <!-- <div class="section__img-contnr">
                    <img
                        class="section__img"
                        alt="category"
                        v-bind:src="item.hdThumbnailUrl"
                    />
                </div> -->
            <p class="section__descr">{{ item.cost }}</p>
        </div>
    </NuxtLink>
    <!-- </router-link> -->
    <!-- </div> -->
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Category } from '@/types/Category'
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
    /* margin: 10px; */
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

.one-section:hover .section__img {
    transform: scale(1.05);
}
</style>
