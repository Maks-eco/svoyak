<template>
    <div>
        <span class="player-icon__wrapper" v-for="icon in imageList">
            <img
                @click="choosedIcon(icon.id)"
                class="player-icon__image"
                :class="{ 'player-icon__choosed': icon.choosed }"
                alt="some"
                :src="location + icon.id + '.svg'"
            />
        </span>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Icon {
    id: string
    choosed: boolean
}
const runtimeConfig = useRuntimeConfig()
const location = ref('')
const imageList = ref([] as Icon[])

const emit = defineEmits(['iconSet'])

const choosedIcon = function (id: string) {
    imageList.value.map((item, index) => {
        if (item.id === id) {
            imageList.value[index].choosed = true
        } else {
            imageList.value[index].choosed = false
        }
    })
    emit('iconSet', id)
}

onMounted(async () => {
    for (let index = 0; index < 30; index++) {
        imageList.value[index] = { id: (index + 1).toString(), choosed: false }
    }

    if (runtimeConfig.app?.baseURL && window.location?.origin)
        location.value =
            window.location.origin +
            runtimeConfig.app?.baseURL +
            'images/looks/'
})
</script>

<style scoped lang="less">
.player-icon {
    &__wrapper {
    }
    &__image {
        width: 70px;
    }
    &__choosed {
        border: 1px solid brown;
    }
}
</style>
