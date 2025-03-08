<template>
    <div v-if="!isNameInBase" class="form-grid">
        <div class="link__wrapper">
            <NuxtLink class="link--admin" to="/admin_panel">
                Зайти за админа
            </NuxtLink>
            <NuxtLink class="link--playing-field" to="/playing_field">
                На игровое поле</NuxtLink
            >
        </div>
        <IconСhoose class="icons" @iconSet="(id:string) => saveImg(id)" />
        <NameInput
            class="inputs"
            v-if="!isNameInBase"
            @nameSet="(name:string) => sendNewNameToBase(name)"
        />
    </div>
    <button
        v-else
        class="push-button"
        :class="{ inactivate: isInactivateButton }"
        @click="itsPushed()"
    >
        Жамк
    </button>
    <!-- <p>{{ isNameInBase ? 'Imja v base' : 'Ne naideno v base' }}</p> -->
</template>

<script lang="ts" setup>
import { useCounterStore, locStorage } from '@/stores/storage'
import IconСhoose from './IconChoose.vue'

const store = useCounterStore()
const nameCode = ref('')
const nameStor = ref('')
const isNameInBase = ref(false)
const isInactivateButton = ref(false)
const imgId = ref('1')

const saveImg = (id: string) => {
    console.log('i catch image: ', id)
    imgId.value = id
}

const itsPushed = async () => {
    isInactivateButton.value = true
    await store.userDoingTap(nameCode.value)
    setTimeout(() => {
        isInactivateButton.value = false
    }, 2500)
}

const sendNewNameToBase = async (mynameStorage: string) => {
    locStorage.saveData('myname', mynameStorage)
    nameStor.value = mynameStorage
    store
        .sendNewNameToTheBase(nameStor.value, imgId.value)
        .then((id: string) => {
            nameCode.value = id
            isNameInBase.value = true
        })
}

onMounted(async () => {
    const mynameStorage: string | null = locStorage.getData('myname')
    if (mynameStorage) {
        nameStor.value = mynameStorage
        if (nameStor.value) {
            const { isExist, id } = await store.isNameExistInBase(
                nameStor.value
            )
            if (!isExist) {
                isNameInBase.value = false
            } else {
                nameCode.value = id
                isNameInBase.value = true
            }
        }
    }
})
</script>

<style scoped lang="less">
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        'links links'
        'icons inputs';
    margin: auto 20vw;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        grid-template-areas:
            'links'
            'icons'
            'inputs';
        margin: auto 10px;
    }
}
.link {
    &__wrapper {
        grid-area: links;
    }
    &--admin,
    &--playing-field {
        padding: 8px;
        border-radius: 10px;
        background-color: orangered;
        color: white;
        text-decoration: none;
    }
    &--admin {
    }
    &--playing-field {
    }
}
.icons {
    grid-area: icons;
    display: grid;
    grid-template-columns: repeat(4, 60px);
    grid-auto-rows: 45px;
}
.inputs {
    grid-area: inputs;
    display: grid;
}
.push-button {
    font-size: 40px;
    height: 150px;
    width: 300px;
    margin-left: 30px;
    background: @common-primary-color;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    cursor: pointer;

    &:hover {
        background: @common-secondary-color;
    }

    @media (max-width: 600px) {
        height: 150px;
        width: 80vw;
    }
}
.push-button.inactivate {
    pointer-events: none;
    user-select: none;
    background: linear-gradient(
        90deg,
        @warn-primary-color 0%,
        @warn-primary-color 50%,
        @warn-secondary-color 50%,
        @warn-secondary-color 100%
    );
    animation: timer_gradient calc(2.7s * 2) linear;
    background-size: 200% 200%;
}

@keyframes timer_gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}
</style>
