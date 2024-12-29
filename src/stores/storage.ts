import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { StorageProduct } from '../types/StorageProduct'
import type { Category } from '../types/Category'
import type { Product } from '../types/Product'
import type { Question, Round, Theme } from '../types/GameEntities'

const storeId = '108362264'
const token = 'public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs'

import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    getDocs,
    collection,
    setDoc,
    doc,
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyAqtrA7R-eTQEyEsApXu_ZcX4xAIbVbOzw',
    authDomain: 'svoyak-game.firebaseapp.com',
    projectId: 'svoyak-game',
    storageBucket: 'svoyak-game.firebasestorage.app',
    messagingSenderId: '665514390922',
    appId: '1:665514390922:web:00af8370ac10f15e608473',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const options = {
    method: 'GET',
    headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
}

const locStorage = {
    saveData: (name: string, value: any) => {
        localStorage.setItem(name, JSON.stringify(value))
    },
    getData: (name: string) => JSON.parse(localStorage.getItem(name) || ''),
}

const useCounterStore = defineStore('counter', () => {
    let savedVal: StorageProduct[] = []
    try {
        savedVal = locStorage.getData('container')
    } catch {}
    const count = ref(savedVal)
    const getValue = computed(() => {
        return count.value.map((item) => {
            return { id: item.id, count: item.count }
        })
    })

    const getCountItems = computed(() => {
        return count.value.reduce(
            (acc: number, item: StorageProduct) => acc + item.count,
            0
        )
    })

    const saveValue = (id: number) => {
        if (count.value.filter((item) => item.id === id).length === 0) {
            count.value.push({ id, count: 0 })
        }
        count.value = count.value.map((item) => {
            if (item.id === id) {
                return { id, count: item.count + 1 }
            }
            return item
        })
        locStorage.saveData('container', count.value)
    }

    const deleteItem = (id: number) => {
        count.value = count.value.filter((item) => item.id !== id)
        locStorage.saveData('container', count.value)
    }

    const getAllQuestions = async (): Promise<null | Round[]> => {
        const data = await $fetch<null | Round[]>('questions.json')
        return data
    }

    const getOneQuestion = async (
        theme_id: number,
        question_id: number
    ): Promise<null | Question> => {
        const filterValue = (obj: any, key: string, value: any) =>
            obj.find((v: any) => v[key] === value)

        const rounds: Round[] | null = await getAllQuestions()
        let data: null | Question = null
        let theme: Theme | null = null
        if (rounds?.length) {
            theme = filterValue(rounds[0].themes, 'id', theme_id) as Theme
            data = filterValue(theme.questions, 'id', question_id) as Question
        }
        return data
    }

    const getPlayersTapState = async (): Promise<{
        string: string
        centered: any
    }> => {
        try {
            const itemsArray: any[] = []
            const querySnapshot = await getDocs(collection(db, 'users'))
            const gameStateCol = await getDocs(collection(db, 'game_state'))
            const gameStateArray: any[] = []

            gameStateCol.forEach((doc) => {
                gameStateArray.push({ ...doc.data(), id: doc.id })
                // console.log(`${doc.id} => ${doc.data()}`, doc.data())
            })
            let gameStateValue: any = gameStateArray[0].question_timestamp

            querySnapshot.forEach((doc) => {
                itemsArray.push({ ...doc.data(), id: doc.id })
                // console.log(`${doc.id} => ${doc.data()}`, doc.data())
            })

            const timestampConcatMilliseconds = (timestamp: any) => {
                const res =
                    timestamp.seconds * 1e3 + timestamp.nanoseconds / 1e6

                // console.log('r', res)
                return res
            }

            const result: any[] = []
            itemsArray.map((item: any) => {
                // return item.hasOwnProperty('timestamp')
                for (const [key, value] of Object.entries(item)) {
                    // console.log(`${key}: ${value}`);
                    if (key.includes('timestamp'))
                        result.push({
                            //...item,
                            timestamp: value,
                            name: item.name,
                        })
                }
                return
            })
            // console.log('result', result)
            const resultSorted = result.sort(
                (a: any, b: any) =>
                    timestampConcatMilliseconds(a.timestamp) -
                    timestampConcatMilliseconds(b.timestamp)
            )

            const centered = resultSorted.map((item) => {
                const centerWithSign =
                    timestampConcatMilliseconds(item.timestamp) -
                    timestampConcatMilliseconds(gameStateValue)
                return {
                    ...item,
                    center: centerWithSign,
                    centerUnsign: Math.abs(centerWithSign),
                    sign: centerWithSign >= 0 ? 1 : -1,
                    ts: timestampConcatMilliseconds(item.timestamp),
                    // gs: gameStateValue.seconds,
                    // is: item.seconds,
                }
            })
            const centerSorted = centered.sort(
                (a: any, b: any) => a.centerUnsign - b.centerUnsign
            )
            let strRes = ''
            resultSorted.forEach((item, index) => {
                strRes += `${item.name} was ${index + 1}, `
            })
            // console.log('result', result, strRes)
            return { string: strRes.slice(0, -2), centered: centerSorted }
        } catch (e) {
            console.error('Error adding document: ', e)
            return { string: '', centered: null }
        }
    }

    const clearPlayersTapState = async () => {
        try {
            const itemsArray: any[] = []
            const querySnapshot = await getDocs(collection(db, 'users'))
            querySnapshot.forEach((doc) => {
                itemsArray.push({ ...doc.data(), id: doc.id })
                // console.log(`${doc.id} => ${doc.data()}`, doc.data())
            })

            const result: any[] = []
            itemsArray.map(async (item: any) => {
                await setDoc(doc(db, 'users', item.id), { name: item.name })

                // return
            })
        } catch (e) {
            console.error('Error adding document: ', e)
        }
    }

    const getGameState = async () => {
        const gameStateArray: any[] = []
        const gameStateCollection = await getDocs(collection(db, 'game_state'))
        gameStateCollection.forEach((doc) => {
            gameStateArray.push({ ...doc.data(), id: doc.id })
        })
        if (gameStateArray.length > 0) return gameStateArray[0]
        return null
    }

    return {
        db,
        count,
        getValue,
        getCountItems,
        saveValue,
        deleteItem,
        getAllQuestions,
        getOneQuestion,
        getPlayersTapState,
        getGameState,
        clearPlayersTapState,
    }
})

export default useCounterStore
