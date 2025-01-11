<template>
    <br /><br /><br />
    <NameInput v-if="!isNameInBase" @nameSet="sendNewNameToBase()" />
    <button
        class="get_someth"
        :class="{ inactivate: isInactivateButton }"
        @click="itsPushed()"
    >
        Жамк
    </button>
    <!-- <p>{{ isNameInBase ? 'Imja v base' : 'Ne naideno v base' }}</p> -->
</template>

<script lang="ts" setup>
import useCounterStore from '@/stores/storage'

const store = useCounterStore()
const nameCode = ref('')
const nameStor = ref('')
const isNameInBase = ref(false)
const isInactivateButton = ref(false)

const itsPushed = async () => {
    isInactivateButton.value = true
    await store.userDoingTap(nameCode.value)
    setTimeout(() => {
        isInactivateButton.value = false
    }, 2500)
}

const sendNewNameToBase = async () => {
    const mynameStorage = localStorage.getItem('myname')
    nameStor.value = mynameStorage ? mynameStorage : ''
    store.sendNewNameToTheBase(nameStor.value).then((id) => {
        nameCode.value = id
        isNameInBase.value = true
    })
}

onMounted(async () => {
    const mynameStorage = localStorage.getItem('myname')
    nameStor.value = mynameStorage ? mynameStorage : ''
    if (nameStor.value) {
        const { isExist, id } = await store.isNameExistInBase(nameStor.value)
        if (!isExist) {
            isNameInBase.value = false
        } else {
            nameCode.value = id
            isNameInBase.value = true
        }
    }
})
</script>

<style scoped lang="less">
.get_someth {
    font-size: 40px;
    height: 150px;
    width: 300px;
    margin-left: 30px;

    @media (max-width: 600px) {
        height: 150px;
        width: 80vw;
        // margin-left: 100vw;
    }
}
.get_someth.inactivate {
    background-color: #ddd;
    pointer-events: none;
    user-select: none;
    // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background: linear-gradient(
        90deg,
        rgba(244, 117, 33, 1) 0%,
        rgba(244, 117, 33, 1) 50%,
        rgba(246, 153, 27, 1) 50%,
        rgba(246, 153, 27, 1) 100%
    );
    animation: gradient calc(2.7s * 2) linear;
    background-size: 200% 200%;
}

@keyframes gradient {
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
form {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type='text'],
input[type='date'],
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.radio-group {
    display: flex;
    gap: 15px;
}

button {
    background: #50426c;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
}

button:hover {
    background: #67568c;
}

.error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    display: none;
}
</style>
