import { inject, Injectable, signal } from '@angular/core'
import { Router } from '@angular/router'
import { Question } from '../models/question.model'
import { QuestionService } from './question.service'

@Injectable({ providedIn: 'root' })
export class GameStateService {
    private readonly questionService = inject(QuestionService)
    private readonly router = inject(Router)

    readonly lives = signal<number>(3)
    readonly score = signal<number>(0)
    readonly streak = signal<number>(0)
    readonly maxStreak = signal<number>(0)
    readonly currentQuestion = signal<Question | null>(null)
    readonly isAnswered = signal<boolean>(false)
    readonly lastAnswerCorrect = signal<boolean | null>(null)
    readonly selectedChoice = signal<string | null>(null)
    readonly isLoading = signal<boolean>(false)

    async startGame(): Promise<void> {
        this.lives.set(3)
        this.score.set(0)
        this.streak.set(0)
        this.maxStreak.set(0)
        this.currentQuestion.set(null)
        this.isAnswered.set(false)
        this.lastAnswerCorrect.set(null)
        this.selectedChoice.set(null)
        this.isLoading.set(true)

        await this.questionService.loadQuestions()

        this.isLoading.set(false)
        this.advanceQuestion()
        await this.router.navigate(['/game'])
    }

    submitAnswer(choice: string): void {
        if (this.isAnswered()) return

        this.isAnswered.set(true)
        this.selectedChoice.set(choice)

        const correct = choice === this.currentQuestion()!.correct

        if (correct) {
            this.score.update(s => s + 10 + this.streak() * 2)
            this.streak.update(s => s + 1)
            if (this.streak() > this.maxStreak()) {
                this.maxStreak.set(this.streak())
            }
            this.lastAnswerCorrect.set(true)
        } else {
            this.lives.update(l => l - 1)
            this.streak.set(0)
            this.lastAnswerCorrect.set(false)
        }

        if (this.lives() === 0) {
            setTimeout(() => this.router.navigate(['/game-over']), 900)
        }
    }

    nextQuestion(): void {
        if (this.lives() === 0) return
        this.advanceQuestion()
    }

    private advanceQuestion(): void {
        this.currentQuestion.set(this.questionService.nextQuestion())
        this.isAnswered.set(false)
        this.lastAnswerCorrect.set(null)
        this.selectedChoice.set(null)
    }
}
