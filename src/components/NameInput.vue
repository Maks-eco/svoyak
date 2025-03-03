<template>
    <div>
        <div>
            <h4 class="input-subtitle">Своя игра</h4>
            <h2 class="input-title">Создать игрока</h2>
        </div>
        <div class="name-info__wrapper">
            <input
                class="name-info__input"
                :class="{ 'name-info__input--filled': !isNameEmpty }"
                id="login"
                name="login"
                type="text"
                v-model="name"
                maxlength="20"
            />
            <label class="name-info__label" for="login">{{
                storedName ? 'Твой ник: ' + storedName : 'Введи ник:'
            }}</label>
        </div>
        <p><-- выбери своё тотемное животное</p>
        <button class="save-button" @click="saveName">Сохранить</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { locStorage } from '@/stores/storage'

const name = ref('')
const storedName = ref('')
const isNameEmpty = ref(true)

const emit = defineEmits(['nameSet'])

const saveName = () => {
    if (name.value !== '') {
        storedName.value = name.value
        emit('nameSet', name.value)
    }
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
</script>

<style scoped lang="less">
.input-subtitle,
.input-title {
    text-align: right;
    color: orangered;
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
        border-bottom: 2px solid orangered;

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

.save-button {
    padding: 8px;
    border: none;
    border-radius: 10px;
    background-color: orangered;
    color: white;
    text-decoration: none;
    align-self: end;
}
</style>
