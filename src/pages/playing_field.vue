<template>
    <QuestionGrid class="wrapper__questions" />
    <PlayersStatusRow class="wrapper__players" />
</template>

<script lang="ts" setup>
// import useCounterStore from '@/stores/storage'
// const store = useCounterStore()

// onMounted(() => {
//     store.initPlayersState()
// })
</script>

<style scoped lang="less">
@padding_fields: 10px;
.wrapper__questions,
.wrapper__players {
    padding: @padding_fields;
}

.wrapper__questions {
    width: calc(100vw - @padding_fields * 2);
    height: calc(70vh - @padding_fields * 2);
}
.wrapper__players {
    width: calc(100vw - @padding_fields * 2);
    height: calc(30vh - @padding_fields * 2);
}
</style>
