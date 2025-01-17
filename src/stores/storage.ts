import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Question, Round, Theme } from '../types/QuestionEntities'

import type { PlayersStatus, Tap } from '~/types/PlayerEntities'

// type PlayersStatusAndId = Partial<PlayersStatus> & {
//     idInBase: string
// }

const storeId = '108362264'
const token = 'public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs'

import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    getDoc,
    getDocs,
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
    getData: (name: string) => JSON.parse(localStorage.getItem(name) || ''),
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
            })
            let gameStateValue: any = gameStateArray[0].question_timestamp

            querySnapshot.forEach((doc) => {
                itemsArray.push({ ...doc.data(), id: doc.id })
            })

            const timestampConcatMilliseconds = (timestamp: any) => {
                const res =
                    timestamp.seconds * 1e3 + timestamp.nanoseconds / 1e6

                // console.log('r', res)
                return res
            }

            const result: any[] = []
            itemsArray.map((item: any) => {
                for (const [key, value] of Object.entries(item)) {
                    if (key.includes('timestamp'))
                        result.push({
                            //...item,
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
            })

            const result: any[] = []
            itemsArray.map(async (item: any) => {
                await setDoc(doc(db, 'users', item.id), { ...item, taps: [] })

                // return
            })
        } catch (e) {
            console.error('Error adding document: ', e)
        }
    }

    interface gameStat {
        data: PlayersStatus[]
        question_timestamp: any
        question_cost: number
        question_ask: string
        question_answer: string
    }

    const getGameState = async (): Promise<{
        allData: gameStat
        idInBase: string
    } | null> => {
        const gameStateArray: gameStat[] = []
        let stateId = ''
        const gameStateCollection = await getDocs(collection(db, 'game_state'))
        gameStateCollection.forEach((doc) => {
            gameStateArray.push(doc.data() as gameStat)
            stateId = doc.id
        })

        if (gameStateArray.length > 0)
            return { allData: gameStateArray[0], idInBase: stateId }
        return null
    }

    const setPlayersData = async (data: PlayersStatus[]) => {
        const gameState = await getGameState()
        console.log('setPlayersData', gameState)
        if (gameState) {
            {
                const docRef = doc(db, 'game_state', gameState.idInBase)
                const updateTimestamp = await updateDoc(docRef, {
                    data: data,
                })
            }
        }
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
            const docRef = doc(db, 'game_state', gameState?.idInBase)
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
            const itemsArray: any[] = []
            const querySnapshot = await getDocs(collection(db, 'users'))
            querySnapshot.forEach((doc) => {
                itemsArray.push({ ...doc.data(), id: doc.id })
                // console.log(`${doc.id} => ${doc.data()}`, doc.data())
            })
            const result = itemsArray.filter((item: any) => {
                return (
                    item?.name?.toString() === searchedName
                ) /*nameStor.value */
            })
            console.log('?', result, itemsArray)
            return { isExist: result.length !== 0, id: result[0].id }
        } catch (e) {
            console.error('Error adding document: ', e)
            return { isExist: false, id: 0 }
        }
    }

    const sendNewNameToTheBase = async (
        localStoredName: string
    ): Promise<string> => {
        const { isExist } = await isNameExistInBase(localStoredName)
        return new Promise(async (resolve, reject) => {
            if (!isExist) {
                try {
                    const newPlayerData: PlayersStatus = {
                        id: 'some',
                        name: localStoredName,
                        points: 0,
                        image: '1.svg',
                        taps: [],
                    }
                    const docRef = await addDoc(collection(db, 'users'), {
                        // name: localStoredName,
                        ...newPlayerData,
                    })
                    await updateDoc(docRef, {
                        id: docRef.id,
                    })
                    console.log('Document written with ID: ', docRef.id)
                    // nameCode.value = docRef.id
                    // isNameInBase.value = true
                    resolve(docRef.id)
                } catch (e) {
                    console.error('Error adding document: ', e)
                    reject(e)
                }
            } else {
                reject('Already adding to the document')
            }
        })
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
        // taps.push(serverTimestamp())
        // taps={
        //     ['timestamp' + Date.now().toString().slice(-7)]: serverTimestamp(),
        // })

        console.log(taps)
        await updateDoc(docRef, { taps: taps })
    }

    return {
        getAllQuestions,
        getOneQuestion,
        getPlayersTapState,
        getGameState,
        clearPlayersTapState,
        setPlayersData,
        setAnsweredQuestion,
        getStatusThisQuestion,
        globalRound,
        tapsInputWasStarted,
        isNameExistInBase,
        sendNewNameToTheBase,
        userDoingTap,
    }
})

export default useCounterStore
