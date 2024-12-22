import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { StorageProduct } from '../types/StorageProduct'
import type { Category } from '../types/Category'
import type { Product } from '../types/Product'

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

    const getCategoryData = (parentId: string): Promise<null | Category[]> => {
        return fetch(
            `https://app.ecwid.com/api/v3/${storeId}/categories?parent=${parentId}&productIds=true`,
            options
        )
            .then((response) => response.json())
            .then((response) => {
                return response.items as Category[]
            })
            .catch((err) => {
                console.error(err)
                return null
            })
    }

    const getProductData = (): Promise<null | Product[]> => {
        return fetch(
            `https://app.ecwid.com/api/v3/${storeId}/products`,
            options
        )
            .then((response) => response.json())
            .then((response) => {
                return response.items as Product[]
            })
            .catch((err) => {
                console.log(err.message)
                return null
            })
    }

    const getProductDataById = async (id: string): Promise<null | Product> => {
        const data = await $fetch<null | Product[]>('products.json')
        let finded = null
        if (data)
            finded = data.find((item: Product) => {
                return item.id.toString() === id
            }) as Product
        return finded
    }

    const getAllProduct = async (page: number): Promise<null | Product[]> => {
        const data = await $fetch<null | Product[]>('products.json')
        return data
    }

    const getProductDataByCategoryId = async (
        page: number,
        id: string
    ): Promise<null | Product[]> => {
        let idsList: any = await fetch(
            `https://app.ecwid.com/api/v3/${storeId}/categories?productIds=true`,
            options
        )
            .then((response) => response.json())
            .then((response) => {
                const category = response.items.filter(
                    (item: any) => item.id.toString() === id
                )[0]
                if (!category?.productIds) return null
                const idsListBuf = category.productIds
                    .slice((page - 1) * 6, page * 6)
                    .join(',')
                if (idsListBuf.length < 1) return null
                return idsListBuf
            })
            .catch((err) => {
                console.error(err)
                return null
            })
        if (!idsList) return null
        return fetch(
            `https://app.ecwid.com/api/v3/${storeId}/products?productId=${idsList}`,
            options
        )
            .then((response) => response.json())
            .then((response) => {
                return response.items as Product[]
            })
            .catch((err) => {
                console.error(err)
                return null
            })
    }

    return {
        count,
        getValue,
        getCountItems,
        saveValue,
        deleteItem,
        getAllProduct,
        getCategoryData,
        getProductData,
        getProductDataById,
        getProductDataByCategoryId,
    }
})

export default useCounterStore
