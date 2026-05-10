import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Question } from '../models/question.model'

function shuffle<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
    private readonly http = inject(HttpClient)
    private allQuestions: Question[] = []
    private pool: Question[] = []
    private poolIndex = 0

    async loadQuestions(): Promise<void> {
        if (this.allQuestions.length > 0) return
        this.allQuestions = await firstValueFrom(
            this.http.get<Question[]>('assets/questions.json')
        )
        this.resetPool()
    }

    nextQuestion(): Question {
        if (this.poolIndex >= this.pool.length) {
            this.resetPool()
        }
        return this.pool[this.poolIndex++]
    }

    private resetPool(): void {
        this.pool = [...this.allQuestions]
        shuffle(this.pool)
        this.poolIndex = 0
    }
}
