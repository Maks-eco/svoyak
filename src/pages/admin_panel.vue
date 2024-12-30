<template>
    <div>
        <br /><br /><br /><br />
        <button id="get_somethg" @click="itsPushed()">Clear someth!</button>
        <br />
        <!-- <button id="get_somethg" @click="itsInited()">Init players</button> -->
        <!-- <p>admin panel</p> -->
        <p>{{ tapsState }}</p>
        <p>{{ questionCost }}</p>
        <div class="panel__divider">
            <div>
                <div
                    class="answer__item"
                    v-for="answer in answerList"
                    :key="answer.ts"
                    :class="{
                        first: answer.first,
                        'false-start': answer.sign < 0,
                    }"
                >
                    <div>
                        {{ answer.name }}: {{ answer.converted }} (
                        {{ answer.center }})
                    </div>
                </div>
            </div>
            <div>
                <div
                    class="players__item"
                    v-for="player in playersStatus"
                    :key="player.id"
                >
                    <div>
                        {{ player.name }}: {{ player.points }}
                        <input
                            type="number"
                            maxlength="6"
                            v-model="player.ref"
                        /><button @click="changeStat(player.id, player.ref)">
                            Add
                        </button>
                        <button @click="changeStat(player.id, -player.ref)">
                            Om-nom-nom
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useCounterStore from '@/stores/storage'
import type { PlayersStatus } from '@/types/GameEntities'

const store = useCounterStore()
const tapsState = ref('')
const ratedState = ref('')
const questionCost = ref(0)
// const ratedState = ref('')
const answerList = ref([] as any[])
const playersStatus = ref([] as PlayersStatusAndRef[] | null)
let ddd: any

type PlayersStatusAndRef = Partial<PlayersStatus> & {
    ref: number //globalThis.Ref<number, number>
}
const changeStat = (id: any, ref: any) => {
    console.log(id, ref)
}
const itsPushed = async () => {
    store.clearPlayersTapState()
}

const itsInited = async () => {
    // store.setPlayersData()
}

const sortThis = (centered: any[]) => {
    const mapNames = new Map()
    // mapNames.set('a', 1)
    // console.log()

    const centerCleared = centered.map((item) => {
        if (!mapNames.get(item.name)) {
            mapNames.set(item.name, 1)
            return { ...item, first: true }
        }
        return { ...item, first: false }
    })

    const centerConverted = centerCleared.map((item) => {
        return { ...item, converted: msToTime(item.centerUnsign) }
    })

    console.log('cc', centerConverted)
    return centerConverted
}

function msToTime(duration: any) {
    let milliseconds: any = Math.floor(duration % 1000),
        seconds: any = Math.floor((duration / 1000) % 60),
        minutes: any = Math.floor((duration / (1000 * 60)) % 60),
        hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    return hours + ':' + minutes + ':' + seconds + '.' + milliseconds
}

onMounted(async () => {
    store.getGameState().then((info) => {
        if (info) {
            const bufarray: PlayersStatus[] = info.allData.data

            questionCost.value = info.allData.question_cost

            bufarray.forEach((bufitem) => {
                playersStatus.value?.push({
                    ...bufitem,
                    ref: info.allData.question_cost,
                })
            })
            console.log('pv', bufarray, playersStatus.value)
        }
    })
    // store.initPlayersState()
    // console.log(
    //     'timestamp' + Date.now().toString().slice(-5),
    //     'timestamp' + Date.now()
    // )
    setInterval(async () => {
        ;({ string: tapsState.value, centered: ddd } =
            await store.getPlayersTapState())
        console.log('upd_tap_info', ddd)
        answerList.value = sortThis(ddd)
    }, 2000)
})
// getPlayersTapState
</script>

<style scoped>
.players__item {
    display: flex;
    justify-content: flex-end;
}
.panel__divider {
    display: flex;
}
.answer__item {
    color: gray;
    font-weight: bold;
}
.first {
    background-color: rgb(29, 133, 8);
}
.false-start {
    color: rgb(126, 85, 32);
}
.first,
.first.false-start {
    /* background-color: red; */
    color: white;
    width: fit-content;
    border-radius: 12px;
    padding: 3px 15px;
}
.first.false-start {
    background-color: red;
}
</style>
