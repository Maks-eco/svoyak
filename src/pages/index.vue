<template>
  <button @click="setLocale('en')">en</button>
  <button @click="setLocale('ru')">ru</button>
  <p>{{ $t('mes') }}</p>
  <!-- <metainfo /> -->
  <CartButton />
  <!-- <CategoryList /> -->
  <ProductList />
</template>

<script lang="ts" setup>
const { locale, setLocale } = useI18n()
</script>
