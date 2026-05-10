import { Component, inject, OnInit } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import { GameStateService } from '../../core/services/game-state.service'
import { ChoiceButtonComponent } from './choice-button/choice-button.component'

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [NgFor, NgIf, ChoiceButtonComponent],
    template: `
        <div class="min-h-screen bg-slate-50 flex flex-col">

            <!-- Header bar -->
            <div class="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between max-w-md mx-auto w-full">
                <div class="flex gap-1 text-xl">
                    @for (heart of hearts(); track $index) {
                        <span [class]="heart ? 'text-red-500' : 'text-slate-300'">{{ heart ? '❤️' : '🤍' }}</span>
                    }
                </div>

                <div class="flex items-center gap-3">
                    @if (gameState.streak() > 0) {
                        <span class="bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold myanmar-text">
                            🔥 {{ gameState.streak() }}
                        </span>
                    }
                    <span class="text-sky-600 font-bold text-lg">{{ gameState.score() }}</span>
                    <span class="text-slate-400 text-xs myanmar-text">မှတ်</span>
                </div>
            </div>

            <!-- Game area -->
            <div class="flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">

                @if (gameState.isLoading()) {
                    <div class="text-slate-400 myanmar-text text-lg">ခဏစောင့်ပါ...</div>
                } @else if (gameState.currentQuestion()) {
                    <!-- Question prompt -->
                    <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6 w-full text-center">
                        <p class="text-xs text-slate-400 uppercase tracking-wide mb-3 font-medium">
                            {{ gameState.currentQuestion()!.mode === 'suffix' ? 'နောက်ပိုင်း ဖြည့်ပါ' : 'ရှေ့ပိုင်း ဖြည့်ပါ' }}
                        </p>
                        <p class="text-4xl myanmar-text font-bold text-slate-800 leading-loose">
                            @if (gameState.currentQuestion()!.mode === 'suffix') {
                                {{ gameState.currentQuestion()!.base }}<span class="text-sky-400">___</span>
                            } @else {
                                <span class="text-sky-400">___</span>{{ gameState.currentQuestion()!.base }}
                            }
                        </p>
                    </div>

                    <!-- Choices grid -->
                    <div class="grid grid-cols-2 gap-3 w-full mb-6">
                        @for (choice of gameState.currentQuestion()!.choices; track choice) {
                            <app-choice-button
                                [choice]="choice"
                                [isAnswered]="gameState.isAnswered()"
                                [correctAnswer]="gameState.currentQuestion()!.correct"
                                [selectedChoice]="gameState.selectedChoice()"
                                (selected)="onAnswer($event)"
                            />
                        }
                    </div>

                    <!-- Feedback + next button -->
                    @if (gameState.isAnswered() && gameState.lives() > 0) {
                        <div class="w-full text-center">
                            @if (gameState.lastAnswerCorrect()) {
                                <p class="text-green-600 font-semibold myanmar-text mb-3">
                                    ✅ မှန်သည်! +{{ 10 + (gameState.streak() - 1) * 2 }} မှတ်
                                </p>
                            } @else {
                                <p class="text-red-600 font-semibold myanmar-text mb-3">
                                    ❌ မှားသည်
                                </p>
                            }
                            <button
                                (click)="onNext()"
                                class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all myanmar-text"
                            >
                                နောက်မေးခွန်း →
                            </button>
                        </div>
                    }
                }
            </div>
        </div>
    `,
})
export class GameComponent implements OnInit {
    readonly gameState = inject(GameStateService)

    ngOnInit(): void {
        if (!this.gameState.currentQuestion()) {
            this.gameState.startGame()
        }
    }

    hearts(): boolean[] {
        return Array.from({ length: 3 }, (_, i) => i < this.gameState.lives())
    }

    onAnswer(choice: string): void {
        this.gameState.submitAnswer(choice)
    }

    onNext(): void {
        this.gameState.nextQuestion()
    }
}
