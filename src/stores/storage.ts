import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Question, Round, Theme } from '../types/QuestionEntities'

import type { PlayersStatus, Tap, gameStat } from '~/types/PlayerEntities'

import {
    getDoc,
    getDocs,
    deleteDoc,
    collection,
    setDoc,
    doc,
    addDoc,
    updateDoc,
    serverTimestamp,
    Firestore,
} from 'firebase/firestore'
//rebuild
const locStorage = {
    saveData: (name: string, value: any) => {
        localStorage.setItem(name, JSON.stringify(value))
    },
    getData: <T>(name: string): T | null => {
        let value
        try {
            let stored = localStorage.getItem(name)
            if (stored) {
                value = JSON.parse(stored)
                return value as T
            }
            return null
        } catch {
            return null
        }
    },
    removeData: (name: string) => {
        localStorage.removeItem(name)
    },
}

const useCounterStore = defineStore('counter', () => {
    const nuxtApp = useNuxtApp()
    const db = nuxtApp.$firestore as Firestore

    const getAllQuestions = async (
        page: number = 1
    ): Promise<null | Round[]> => {
        const data = await $fetch<null | Round[]>(`questions${page}.json`)
        return data
    }

    const getOneQuestion = async (
        theme_id: number,
        question_id: number
    ): Promise<null | Question> => {
        const filterValue = (obj: any, key: string, value: any) =>
            obj.find((v: any) => v[key] === value)

        const rounds: Round[] | null = await getAllQuestions(globalRound())
        let data: null | Question = null
        let theme: Theme | null = null
        if (rounds?.length) {
            theme = filterValue(rounds[0].themes, 'id', theme_id) as Theme
            data = filterValue(theme.questions, 'id', question_id) as Question
        }
        return data
    }

    const getBaseDocs = async <ListItemType>(
        doc_name: string
    ): Promise<ListItemType[]> => {
        const itemsArray: ListItemType[] = []
        const querySnapshot = await getDocs(collection(db, doc_name))

        querySnapshot.forEach((doc) => {
            itemsArray.push({
                ...(doc.data() as ListItemType),
                id: doc.id,
            })
        })

        return itemsArray
    }

    const getPlayersTapState = async (): Promise<{
        string: string
        centered: any
    }> => {
        try {
            const itemsArray: PlayersStatus[] =
                await getBaseDocs<PlayersStatus>('users')
            const gameStateArray: gameStat[] = await getBaseDocs<gameStat>(
                'game_state'
            )
            let gameStateValue: any = gameStateArray[0].question_timestamp

            const timestampConcatMilliseconds = (timestamp: any) => {
                const res =
                    timestamp.seconds * 1e3 + timestamp.nanoseconds / 1e6
                return res
            }
            const result: any[] = []
            itemsArray.map((item: PlayersStatus) => {
                for (const [key, value] of Object.entries(item.taps)) {
                    result.push({
                        timestamp: value,
                        name: item.name,
                    })
                }
                return
            })

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
                }
            })
            const centerSorted = centered.sort(
                (a: any, b: any) => a.centerUnsign - b.centerUnsign
            )
            let strRes = ''
            resultSorted.forEach((item, index) => {
                strRes += `${item.name} was ${index + 1}, `
            })
            return { string: strRes.slice(0, -2), centered: centerSorted }
        } catch (e) {
            return { string: '', centered: null }
        }
    }

    const clearPlayersTapState = async () => {
        try {
            const itemsArray: PlayersStatus[] =
                await getBaseDocs<PlayersStatus>('users')
            itemsArray.map(async (item: PlayersStatus) => {
                await setDoc(doc(db, 'users', item.id), { ...item, taps: [] })
            })
        } catch (e) {}
    }

    const getGameState = async (): Promise<{
        allData: gameStat
        idInBase: string
    } | null> => {
        const gameStateArray = await getBaseDocs<gameStat>('game_state')
        if (gameStateArray.length > 0)
            return {
                allData: gameStateArray[0],
                idInBase: gameStateArray[0].id,
            }
        return null
    }

    const getPlayersData = async (): Promise<{
        allData: PlayersStatus[]
    } | null> => {
        const playersStateArray = await getBaseDocs<PlayersStatus>('users')
        const playersStateArrayWithoutAdmin = playersStateArray.filter(
            (item) => item.name !== 'admin'
        )

        if (playersStateArray.length > 0)
            return { allData: playersStateArrayWithoutAdmin }
        return null
    }

    const setPlayerData = async <Type extends { [x: string]: any }>(
        id: string,
        data: Type
    ) => {
        const docRef = doc(db, 'users', id)
        await updateDoc(docRef, { ...data })
    }

    const globalRound = (id?: number): number => {
        let round: number
        const storageRound: string | null =
            locStorage.getData<string>('globalRound')
        if (id) {
            locStorage.saveData('globalRound', id)
            round = id
        } else if (storageRound) {
            round = parseInt(storageRound)
        } else {
            locStorage.saveData('globalRound', 1)
            round = 1
        }
        return round
    }

    interface Answers {
        [key: string]: boolean
    }

    const setAnsweredQuestion = (theme: any, id: any) => {
        let savedVal: Answers | null =
            locStorage.getData<Answers>('containerAnswer')

        savedVal = { ...savedVal, [`${theme}_${id}`]: true }
        locStorage.saveData('containerAnswer', savedVal)
    }

    const getStatusThisQuestion = (theme: string, id: string): boolean => {
        let savedVal: Answers | null =
            locStorage.getData<Answers>('containerAnswer')
        if (savedVal) {
            const index: string = `${theme}_${id}`
            if (savedVal[index]) {
                return savedVal[index]
            } else {
                return false
            }
        }
        return false
    }

    const tapsInputWasStarted = async (question: Question | null) => {
        const gameState = await getGameState()
        if (gameState?.idInBase && question) {
            const docRef = doc(db, 'game_state', gameState.idInBase)
            const updateTimestamp = await updateDoc(docRef, {
                question_timestamp: serverTimestamp(),
                question_cost: question.cost,
                question_ask: question.ask,
                question_answer: question.answer,
            })
        }
    }

    const isNameExistInBase = async (searchedName: string) => {
        try {
            const itemsArray = await getBaseDocs<PlayersStatus>('users')
            const result = itemsArray.filter((item: PlayersStatus) => {
                return item?.name?.toString() === searchedName
            })
            return { isExist: result.length !== 0, id: result[0].id }
        } catch (e) {
            return { isExist: false, id: '0' }
        }
    }

    const makeRandomId = (length: number): string => {
        let result = ''
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length
        let counter = 0
        while (counter < length) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            )
            counter += 1
        }
        return result
    }

    const sendNewNameToTheBase = async (
        localStoredName: string,
        iconId: string
    ): Promise<string> => {
        const { isExist, id } = await isNameExistInBase(localStoredName)
        return new Promise(async (resolve, reject) => {
            if (!isExist) {
                try {
                    const newId = makeRandomId(10)
                    locStorage.saveData('browserId', newId)
                    const newPlayerData: PlayersStatus = {
                        id: 'some',
                        name: localStoredName,
                        points: 0,
                        image: iconId + '.svg',
                        browserId: { id: newId },
                        taps: [],
                    }
                    const docRef = await addDoc(collection(db, 'users'), {
                        ...newPlayerData,
                    })
                    await updateDoc(docRef, {
                        id: docRef.id,
                    })
                    resolve(docRef.id)
                } catch (e) {
                    reject(e)
                }
            } else {
                // reject('Already adding to the document')
                checkBrowserId(id)
                    .then((data) => {
                        resolve(data)
                    })
                    .catch((e) => {
                        reject(e)
                    })
            }
        })
    }

    const checkBrowserId = async (nameCode: string) => {
        let savedId: string | null = locStorage.getData('browserId')
        if (!savedId) {
            savedId = makeRandomId(10)
            locStorage.saveData('browserId', savedId)
        }

        const docRef = doc(db, 'users', nameCode)
        //get value from cookie, compare with entities in broIds
        //if not exist - add new
        const playerData: PlayersStatus = (
            await getDoc(docRef)
        ).data() as PlayersStatus

        const userIds = []
        if (playerData.browserId) {
            for (const [key, value] of Object.entries(playerData.browserId)) {
                userIds.push(value)
            }
        }
        if (!userIds.includes(savedId)) {
            const browserIds = {
                ...playerData.browserId,
                ['id' + Date.now().toString().slice(-7)]: savedId,
            }
            await updateDoc(docRef, { browserId: browserIds })
            throw 'pupa'
        }
        return docRef.id
    }

    const userDoingTap = async (nameCode: string) => {
        const docRef = doc(db, 'users', nameCode)
        const playerData: PlayersStatus = (
            await getDoc(docRef)
        ).data() as PlayersStatus
        const taps = {
            ...playerData.taps,
            ['timestamp' + Date.now().toString().slice(-7)]: serverTimestamp(),
        }
        await updateDoc(docRef, { taps: taps })
    }

    const deleteUser = async (nameCode: string) => {
        await deleteDoc(doc(db, 'users', nameCode))
    }

    return {
        getAllQuestions,
        getOneQuestion,
        getPlayersTapState,
        getGameState,
        clearPlayersTapState,
        getPlayersData,
        setPlayerData,
        setAnsweredQuestion,
        getStatusThisQuestion,
        globalRound,
        tapsInputWasStarted,
        isNameExistInBase,
        sendNewNameToTheBase,
        userDoingTap,
        deleteUser,
    }
})

export { useCounterStore, locStorage }
