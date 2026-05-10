import { Injectable } from '@angular/core'
import { LeaderboardEntry } from '../models/question.model'

const STORAGE_KEY = 'myanmar-game-leaderboard'
const MAX_ENTRIES = 10

@Injectable({ providedIn: 'root' })
export class LeaderboardService {

    getEntries(): LeaderboardEntry[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : []
        } catch {
            return []
        }
    }

    addEntry(name: string, score: number, streak: number): void {
        const entries = this.getEntries()
        entries.push({ name: name.trim() || 'Anonymous', score, streak, date: new Date().toISOString() })
        entries.sort((a, b) => b.score - a.score)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
    }

    clearEntries(): void {
        localStorage.removeItem(STORAGE_KEY)
    }
}
