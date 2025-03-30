<template>
    <div class="form-grid" :key="formKey">
        <div class="link__wrapper">
            <NuxtLink class="link--admin" to="/admin_panel">
                Зайти за админа
            </NuxtLink>
            <NuxtLink class="link--playing-field" to="/playing_field">
                На игровое поле</NuxtLink
            >
        </div>
        <!-- <IconСhoose class="icons" @iconSet="(id:string) => saveImg(id)" /> -->
        <NameInput
            class="inputs"
            v-if="!isNameInBase"
            @nameSet="(name:string, imgId:string) => sendNewNameToBase(name, imgId)"
        />
    </div>
</template>

<script lang="ts" setup>
import { useCounterStore, locStorage } from '@/stores/storage'
// import IconСhoose from '@/components/IconChoose.vue'

const store = useCounterStore()
const nameCode = ref('')
const nameStor = ref('')
const isNameInBase = ref(false)
const formKey = ref(0)

const sendNewNameToBase = async (mynameStorage: string, imageId: string) => {
    locStorage.saveData('myname', mynameStorage)
    nameStor.value = mynameStorage
    store.sendNewNameToTheBase(nameStor.value, imageId).then((id: string) => {
        nameCode.value = id
        isNameInBase.value = true
        formKey.value++
        navigateTo('/')
        formKey.value++
    })
}

onMounted(async () => {
    const mynameStorage: string | null = locStorage.getData('myname')
    if (mynameStorage) {
        navigateTo('/player_panel')
        // nameStor.value = mynameStorage
        // if (nameStor.value) {
        //     const { isExist, id } = await store.isNameExistInBase(
        //         nameStor.value
        //     )
        //     if (!isExist) {
        //         isNameInBase.value = false
        //     } else {
        //         nameCode.value = id
        //         isNameInBase.value = true
        //     }
        // }
    }
})
</script>

<style scoped lang="less">
@top-buttons-color: @common-highlighted-color;
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        'links links'
        'icons inputs'
        'icons other';
    margin: auto 20vw;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        grid-template-areas:
            ' links '
            'inputs '
            ' icons '
            'other';
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
        background-color: @top-buttons-color;
        color: white;
        text-decoration: none;
    }
    &--admin {
    }
    &--playing-field {
    }
}

.inputs {
    grid-area: inputs;
    display: grid;
}
</style>
