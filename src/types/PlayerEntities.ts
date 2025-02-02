interface PlayersStatus {
    id: string
    name: string
    points: number
    image: string
    taps: EctTap //Tap
}

type Tap = Record<string, any>

interface EctTap {
    [timestamp: string]: any
}

type PlayersStatusAndRef = Partial<PlayersStatus> & {
    ref: number
}

interface gameStat {
    // data: PlayersStatus[]
    id: string
    question_timestamp: any
    question_cost: number
    question_ask: string
    question_answer: string
}

export type { PlayersStatus, PlayersStatusAndRef, Tap, gameStat }
