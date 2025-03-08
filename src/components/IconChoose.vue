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
            <div class="player-icon__background"></div>
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
        position: relative;
    }
    &__image {
        width: 70px;
    }
    &__choosed {
        position: relative;
        z-index: 20;
        transform: translateY(-10px);
        transition: transform 0.4s;
    }

    &__background {
        position: absolute;
        top: 0;
        left: 0;
        height: 0;
        width: 0;
        background-color: rgb(255, 255, 255);
        border-radius: 100px;
        z-index: -1;
        opacity: 0;
    }
    @background-padding: 15px;
    &__choosed + &__background {
        top: -@background-padding - 2px;
        left: -@background-padding - 2px;
        padding: @background-padding;
        height: 70px;
        width: 70px;
        z-index: 9;
        border: 2px dashed orangered;
        transform: translateY(-10px);
        opacity: 1;
        transition: transform 0.4s, opacity 0.3s;
    }
}
</style>
