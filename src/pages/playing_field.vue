<template>
    <QuestionGrid class="wrapper__questions" />
    <PlayersStatusRow class="wrapper__players" />
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
@padding_fields: 10px;
.wrapper {
    &__questions,
    &__players {
        padding: @padding_fields;
    }

    &__questions {
        width: calc(100vw - @padding_fields * 2);
        height: calc(70vh - @padding_fields * 2);
    }
    &__players {
        width: calc(100vw - @padding_fields * 2);
        height: calc(30vh - @padding_fields * 2);
    }
}
</style>
