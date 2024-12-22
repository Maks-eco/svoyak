<template>
  <div class="section-contnr">
    <router-link :to="{ name: 'CategoryView', params: { id: item.id } }">
      <div class="one-section">
        <div class="section__img-contnr">
          <img
            class="section__img"
            alt="category"
            v-bind:src="item.hdThumbnailUrl"
          />
        </div>
        <p class="section__descr">{{ item.name }}</p>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Category } from '@/types/Category'

defineProps({
  item: {
    required: true,
    type: Object as PropType<Category>,
  },
})
</script>

<style scoped>
a {
  text-decoration: none;
}
.section-contnr {
  margin-bottom: 50px;
}
.one-section {
  width: 250px;
  height: 260px;
  margin: 10px;
}
.section__descr {
  margin: 5px;
  font-size: 24px;
  color: #333;
  transition: color 0.4s;
}
.one-section:hover .section__descr {
  color: #af66d4;
}
.section__img-contnr {
  width: 160px;
  height: 160px;
  overflow: hidden;
  margin: 20px auto 0px auto;
}
.section__img {
  aspect-ratio: 1 / 1;
  width: 100%;
  object-fit: cover;
  transition: 0.5s all ease-in-out;
}
.one-section:hover .section__img {
  transform: scale(1.05);
}
</style>
