<template>
    <div class="players__container">
        <div
            class="player__wrapper"
            v-for="player in plStatus"
            :key="player.id"
        >
            <!-- <div> -->
            <span class="player__name">{{ player.name }}</span
            >: {{ player.points }}
            <input
                class="player__points-input"
                type="number"
                maxlength="6"
                v-model="player.ref"
            /><button
                class="player__button-add"
                @click="updStatus(player.id, player.ref)"
            >
                Дать
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
import type { PlayersStatus, PlayersStatusAndRef } from '~/types/PlayerEntities'

const props = defineProps({
    playersStatus: {
        required: true,
        type: Object as PropType<PlayersStatus[] | null>,
    },
    questionCost: {
        required: true,
        type: Number,
    },
})
const plStatus = ref([] as PlayersStatusAndRef[] | null)

const { questionCost, playersStatus } = toRefs(props)

watch(questionCost, async () => {
    if (props.playersStatus) {
        plStatus.value = props.playersStatus.map((bufitem) => {
            return { ...bufitem, ref: questionCost.value }
        })
    }
})

watch(playersStatus, async () => {
    if (props.playersStatus) {
        props.playersStatus.forEach((bufitem) => {
            plStatus.value?.forEach((showedItem, index) => {
                if (showedItem.id === bufitem.id)
                    if (plStatus?.value)
                        plStatus.value[index] = { ...showedItem, ...bufitem }
            })
        })
    }
})
</script>

<style scoped lang="less">
.players__container {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.player {
    &__wrapper {
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
        background-color: @accept-primary-color;
    }

    &__button-delete {
        background-color: @decline-primary-color;
    }

    &__points-input {
        width: 60px;
    }
}
</style>
