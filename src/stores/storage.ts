import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { StorageProduct } from '../types/StorageProduct'
import type { Category } from '../types/Category'
import type { Product } from '../types/Product'
import type { Question, Round, Theme } from '../types/GameEntities'

const storeId = '108362264'
const token = 'public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs'

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

    return {
        count,
        getValue,
        getCountItems,
        saveValue,
        deleteItem,
        getAllQuestions,
        getOneQuestion,
    }
})

export default useCounterStore
