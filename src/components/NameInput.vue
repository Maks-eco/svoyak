<template>
    <IconСhoose class="icons" @iconSet="(id:string) => saveImg(id)" />
    <div class="inputs-first-step">
        <h4 class="input-subtitle">Своя игра</h4>
        <h2 class="input-title">Создать игрока</h2>

        <div class="name-info__wrapper">
            <input
                class="name-info__input"
                :class="{ 'name-info__input--filled': !isNameEmpty }"
                id="login"
                name="login"
                type="text"
                v-model="name"
                maxlength="12"
            />
            <label class="name-info__label" for="login">{{
                storedName ? 'Твой ник: ' + storedName : 'Введи ник:'
            }}</label>
        </div>
        <p class="icon-choose__label"><-- выбери своё тотемное животное</p>
    </div>

    <button
        class="save-button"
        :class="{ active: isAllFieldFilled }"
        @click="saveName"
    >
        Сохранить
    </button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { locStorage } from '@/stores/storage'
import IconСhoose from '@/components/IconChoose.vue'

const name = ref('')
const storedName = ref('')
const isNameEmpty = ref(true)
const imgId = ref(null as String | null)
const isAllFieldFilled = ref(false)

const emit = defineEmits(['nameSet'])

const saveName = () => {
    if (name.value !== '' && imgId.value) {
        storedName.value = name.value
        emit('nameSet', name.value, imgId.value)
    }
}

const saveImg = (id: string) => {
    console.log('i catch image: ', id)
    imgId.value = id
}

onMounted(() => {
    const nameStor: string | null = locStorage.getData('myname')
    if (nameStor) {
        storedName.value = name.value = nameStor
    }
})

watch(name, async () => {
    isNameEmpty.value = name.value === '' ? true : false
})

watch([name, imgId], ([newA, newB], [prevA, prevB]) => {
    console.log('name.value', name.value, name.value !== '')
    if (name.value !== '' && imgId.value) {
        isAllFieldFilled.value = true
    } else {
        isAllFieldFilled.value = false
    }
})
</script>

<style scoped lang="less">
@title-color: @common-highlighted-color;
@input-line-color: @common-highlighted-color;
@save-button-color-active: @primary-color-gradient;
@save-button-color-inactive: @inactive-background-color;
@save-button-text-color-active: white;
@save-button-text-color-inactive: @inactive-text-color;
@label-text-color: @text-primary-color;

.inputs-first-step {
    grid-area: inputs;
}
.icons {
    grid-area: icons;
}
.input-subtitle,
.input-title {
    text-align: right;
    color: @title-color;
    margin: 0;
}
.input-subtitle {
    font-size: 16px;
    font-weight: 500;
}
.input-title {
    font-size: 32px;
    font-weight: 800;
}
.name-info {
    &__wrapper {
        align-self: end;
        display: flex;
        flex-direction: column;
    }
    &__label {
        display: block;
        width: fit-content;
        order: -1;
        cursor: text;
        user-select: none;
        transform: translateY(16px);
        transition: transform 0.4s;
    }
    &__input {
        display: block;
        border: none;
        border-bottom: 2px solid @input-line-color;

        &:focus-visible {
            outline: none;
        }
    }

    &__input:focus-visible ~ label,
    &__input--filled ~ label {
        transform: translateY(0px);
        transition: transform 0.4s;
    }
}

.name-info__label {
    color: @inactive-text-color;
}
.icon-choose__label {
    color: @label-text-color;
}

.save-button {
    padding: 8px;
    border: none;
    border-radius: 10px;
    background: @save-button-color-inactive;
    color: @save-button-text-color-inactive;
    font-size: 16px;
    text-decoration: none;
    align-self: end;
    pointer-events: none;
    .shadow-none();

    &.active {
        background: @save-button-color-active;
        pointer-events: all;
        color: @save-button-text-color-active;
        .shadow();
    }

    @media (max-width: 800px) {
        margin-top: 40px;
    }
}
</style>
