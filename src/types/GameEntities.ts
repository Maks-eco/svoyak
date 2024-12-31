interface Question {
    id: number
    description?: string
    ask: string
    answer: string
    cost: number
}

interface Theme {
    id: number
    name: string
    questions: Question[]
}

interface Round {
    id: number
    name: string
    koef: number
    themes: Theme[]
}

interface PlayersStatus {
    id: string
    name: string
    points: number
    image: string
}

export type { Question, Theme, Round, PlayersStatus }
