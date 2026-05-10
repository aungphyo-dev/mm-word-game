export interface Question {
    mode: 'prefix' | 'suffix'
    base: string
    correct: string
    choices: string[]
}

export interface LeaderboardEntry {
    name: string
    score: number
    streak: number
    date: string
}
