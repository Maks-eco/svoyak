<template>
    <div class="players__wrapper">
        <div
            class="players__item"
            v-for="player in playersStatus"
            :key="player.id"
        >
            <!-- <div> -->
            <span class="player__name">{{ player.name }}</span
            >: {{ player.points }}
            <input
                class="points__input"
                type="number"
                maxlength="6"
                v-model="player.ref"
            /><button
                class="player__button-add"
                @click="updStatus(player.id, player.ref)"
            >
                Add
            </button>
            <button
                class="player__button-delete"
                @click="updStatus(player.id, -player.ref)"
            >
                Отжать
            </button>
            <!-- </div> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['saveStatus'])
const updStatus = (id: any, cost: any) => {
    emit('saveStatus', id, cost)
}
import type { PlayersStatusAndRef } from '~/types/PlayerEntities'

const props = defineProps({
    playersStatus: {
        required: true,
        type: Object as PropType<PlayersStatusAndRef[] | null>,
    },
})
</script>

<style scoped lang="less">
.players__wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.players__item {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 3px;
    border-radius: 5px;
    transition: background-color 0.7s;

    &:hover {
        background-color: rgba(0, 0, 255, 0.158);
        transition: background-color 0.3s;
    }
}
.points__input {
    width: 60px;
}
.player {
    &__name {
        font-weight: bold;
    }
    &__button-add,
    &__button-delete {
        border: none;
        border-radius: 5px;
        color: white;
        font-weight: bold;
    }
    &__button-add {
        background-color: rgb(50, 187, 50);
    }
    &__button-delete {
        background-color: rgb(255, 77, 77);
    }
}
</style>
