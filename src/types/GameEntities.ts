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
    name: string
    koef: number
    themes: Theme[]
}

export type { Question, Theme, Round }
