import type { PlayersStatus, PlayersStatusAndRef } from '~/types/PlayerEntities'

const addVisualisationProps = (centered: any[]) => {
    const mapNames = new Map()

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

    return centerConverted
}

const msToTime = (duration: any) => {
    let milliseconds: any = Math.floor(duration % 1000),
        seconds: any = Math.floor((duration / 1000) % 60),
        minutes: any = Math.floor((duration / (1000 * 60)) % 60),
        hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    return hours + ':' + minutes + ':' + seconds + '.' + milliseconds
}

type PlayerPoint = Omit<PlayersStatus, 'image' | 'taps' | 'browserId'>

const changeStat = async (
    playersStat: PlayersStatusAndRef[] | null,
    id: string | undefined,
    ref: any,
    callback: (PlayersStatus: PlayerPoint) => void
) => {
    // type Pal
    const newArray: PlayerPoint[] = []
    console.log('beforesave', playersStat)
    if (playersStat) {
        playersStat.forEach((item) => {
            if (item.id && item.name && item.image) {
                const newItem: PlayerPoint = {
                    id: item.id,
                    name: item.name,
                    points: id === item.id ? item.points + ref : item.points,
                    // image: item.image,
                }
                if (id === item.id) newArray.push(newItem)
            }
        })
    }
    callback(newArray[0])
}

export { addVisualisationProps, changeStat }
export type { PlayerPoint }
