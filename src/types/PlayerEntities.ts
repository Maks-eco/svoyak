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

export type { PlayersStatus, PlayersStatusAndRef, Tap }
