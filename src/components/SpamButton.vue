<template>
    <NameInput @nameSet="sendNewNameToBase()" />
    <button id="get_someth" @click="itsPushed()">Get someth!</button>
    <br /><br /><br />
    <p>{{ places }}</p>
    <p>{{ isNameInBase ? 'Imja v base' : 'Ne naideno v base' }}</p>
</template>

<script lang="ts" setup>
// import { initializeApp } from 'firebase/app'
import {
    addDoc,
    collection,
    serverTimestamp,
    getDocs,
    updateDoc,
    doc,
} from 'firebase/firestore'

import useCounterStore from '@/stores/storage'

const store = useCounterStore()
const db = store.db

const nameCode = ref('')
const places = ref('')
const nameStor = ref('')
const isNameInBase = ref(false)

const itsPushed = async () => {
    const docRef = doc(db, 'users', nameCode.value)
    const updateTimestamp = await updateDoc(docRef, {
        ['timestamp' + Date.now().toString().slice(-7)]: serverTimestamp(),
    })
}

const sendNewNameToBase = async () => {
    const mynameStorage = localStorage.getItem('myname')
    nameStor.value = mynameStorage ? mynameStorage : ''
    const { isExist } = await isExistInBase()
    if (!isExist) {
        try {
            const docRef = await addDoc(collection(db, 'users'), {
                name: nameStor.value,
                // timestamp: serverTimestamp(),
            })
            console.log('Document written with ID: ', docRef.id)
            nameCode.value = docRef.id
            isNameInBase.value = true
        } catch (e) {
            console.error('Error adding document: ', e)
        }
    }
}

const isExistInBase = async () => {
    try {
        const itemsArray: any[] = []
        const querySnapshot = await getDocs(collection(db, 'users'))
        querySnapshot.forEach((doc) => {
            itemsArray.push({ ...doc.data(), id: doc.id })
            // console.log(`${doc.id} => ${doc.data()}`, doc.data())
        })
        const result = itemsArray.filter((item: any) => {
            return item?.name?.toString() === nameStor.value /*nameStor*/
        })
        console.log('?', result, itemsArray)
        return { isExist: result.length !== 0, id: result[0].id }
    } catch (e) {
        console.error('Error adding document: ', e)
        return { isExist: false, id: 0 }
    }
}

onMounted(async () => {
    const mynameStorage = localStorage.getItem('myname')
    nameStor.value = mynameStorage ? mynameStorage : ''
    if (nameStor.value) {
        const { isExist, id } = await isExistInBase()
        if (!isExist) {
            // sendNewNameToBase()
            isNameInBase.value = false
        } else {
            nameCode.value = id
            isNameInBase.value = true
        }
    }
})
</script>

<style scoped lang="less">
#get_someth {
    height: 150px;
    width: 300px;
    margin-left: 30px;

    @media (max-width: 600px) {
        height: 150px;
        width: 80vw;
        margin-left: 100vw;
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
    background: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #45a049;
}

.error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    display: none;
}
</style>
