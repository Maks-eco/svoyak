interface PlayersStatus {
    id: string
    name: string
    points: number
    image: string
}

type PlayersStatusAndRef = Partial<PlayersStatus> & {
    ref: number
}

export type { PlayersStatus, PlayersStatusAndRef }
