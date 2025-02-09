import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Question, Round, Theme } from '../types/QuestionEntities'

import type { PlayersStatus, Tap, gameStat } from '~/types/PlayerEntities'

const storeId = '108362264'
const token = 'public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs'

import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    getDoc,
    getDocs,
    deleteDoc,
    collection,
    setDoc,
    doc,
    addDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyAqtrA7R-eTQEyEsApXu_ZcX4xAIbVbOzw',
    authDomain: 'svoyak-game.firebaseapp.com',
    projectId: 'svoyak-game',
    storageBucket: 'svoyak-game.firebasestorage.app',
    messagingSenderId: '665514390922',
    appId: '1:665514390922:web:00af8370ac10f15e608473',
}

let globalGameState: any = null

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
    getData: (name: string) => {
        let value
        try {
            value = JSON.parse(localStorage.getItem(name) || '')
            return value
        } catch {
            return ''
        }
    },
}

const useCounterStore = defineStore('counter', () => {
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
            console.log('querySnapshot', itemsArray)
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
            console.error('Error adding document: ', e)
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
        } catch (e) {
            console.error('Error adding document: ', e)
        }
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
        if (playersStateArray.length > 0) return { allData: playersStateArray }
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
        let round: number = id ? id : 0
        let bufround: number = NaN
        try {
            bufround = parseInt(locStorage.getData('globalRound'))
        } catch {}
        round = round > 0 ? round : bufround
        locStorage.saveData('globalRound', round)
        console.log(round)
        return round
    }

    const setAnsweredQuestion = (theme: any, id: any) => {
        let savedVal: {} = {}
        try {
            savedVal = locStorage.getData('containerAnswer')
        } catch {}
        savedVal = { ...savedVal, [`${theme}_${id}`]: true }
        locStorage.saveData('containerAnswer', savedVal)
    }

    const getStatusThisQuestion = (theme: string, id: string): boolean => {
        let savedVal: { [key: string]: boolean } = {}
        try {
            savedVal = locStorage.getData('containerAnswer')
        } catch {}
        const index: string = `${theme}_${id}`
        if (savedVal[index]) {
            return savedVal[index]
        } else {
            return false
        }
    }

    const tapsInputWasStarted = async (question: Question | null) => {
        const gameState = await getGameState()
        console.log('gs', gameState)
        if (gameState?.idInBase && question) {
            const docRef = doc(db, 'game_state', gameState.idInBase)
            const updateTimestamp = await updateDoc(docRef, {
                question_timestamp: serverTimestamp(),
                question_cost: question.cost,
                question_ask: question.ask,
                question_answer: question.answer,
            })
        } else {
            console.log('Not started!')
        }
    }

    const isNameExistInBase = async (searchedName: string) => {
        try {
            const itemsArray = await getBaseDocs<PlayersStatus>('users')
            const result = itemsArray.filter((item: PlayersStatus) => {
                return item?.name?.toString() === searchedName
            })
            // console.log('?', result, itemsArray)
            return { isExist: result.length !== 0, id: result[0].id }
        } catch (e) {
            console.error('Error adding document: ', e)
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
                    console.error('Error adding document: ', e)
                    reject(e)
                }
            } else {
                // reject('Already adding to the document')
                checkBrowserId(id)
                    .then((data) => {
                        console.log('then', data)
                    })
                    .catch((data) => {
                        console.log('err', data)
                    })
            }
        })
    }

    const checkBrowserId = async (nameCode: string) => {
        let savedId: string = locStorage.getData('browserId')
        if (savedId === '') {
            const savedId = makeRandomId(10)
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
        console.log(
            'checkBrowserId',
            playerData.browserId,
            userIds,
            savedId,
            userIds.includes(savedId)
        )
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
        console.log(docRef)
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
