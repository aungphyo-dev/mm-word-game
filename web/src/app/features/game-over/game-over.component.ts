import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { GameStateService } from '../../core/services/game-state.service'
import { LeaderboardService } from '../../core/services/leaderboard.service'

@Component({
    selector: 'app-game-over',
    standalone: true,
    imports: [RouterLink, FormsModule],
    template: `
        <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-8 max-w-sm w-full text-center">

                <div class="text-5xl mb-4">😔</div>
                <h1 class="text-2xl font-bold text-slate-800 myanmar-text mb-6">ဂိမ်းပြီးသွားပြီ</h1>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-sky-50 rounded-xl p-4">
                        <p class="text-xs text-slate-500 myanmar-text mb-1">စုစုပေါင်းမှတ်</p>
                        <p class="text-3xl font-bold text-sky-600">{{ gameState.score() }}</p>
                    </div>
                    <div class="bg-orange-50 rounded-xl p-4">
                        <p class="text-xs text-slate-500 myanmar-text mb-1">အများဆုံး ဆက်တိုက်</p>
                        <p class="text-3xl font-bold text-orange-500">{{ gameState.maxStreak() }}</p>
                    </div>
                </div>

                @if (!saved()) {
                    <div class="mb-6">
                        <p class="text-sm text-slate-600 myanmar-text mb-2">မှတ်တမ်းတင်မည်</p>
                        <input
                            [(ngModel)]="playerName"
                            placeholder="နာမည်ထည့်ပါ"
                            maxlength="20"
                            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none mb-2 myanmar-text"
                        />
                        <button
                            (click)="saveScore()"
                            class="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-all text-sm myanmar-text"
                        >
                            မှတ်တမ်းတင်မည်
                        </button>
                    </div>
                } @else {
                    <div class="bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
                        <p class="text-green-700 text-sm myanmar-text">✅ မှတ်တမ်းတင်ပြီးပါပြီ</p>
                    </div>
                }

                <div class="flex gap-3">
                    <button
                        (click)="playAgain()"
                        class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-all myanmar-text"
                    >
                        ထပ်ကစားမည်
                    </button>
                    <a
                        routerLink="/leaderboard"
                        class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all text-center myanmar-text"
                    >
                        မှတ်တမ်း
                    </a>
                </div>
            </div>
        </div>
    `,
})
export class GameOverComponent implements OnInit {
    readonly gameState = inject(GameStateService)
    private readonly leaderboardService = inject(LeaderboardService)

    playerName = ''
    saved = signal(false)

    ngOnInit(): void {
        this.saved.set(false)
    }

    saveScore(): void {
        this.leaderboardService.addEntry(
            this.playerName,
            this.gameState.score(),
            this.gameState.maxStreak(),
        )
        this.saved.set(true)
    }

    playAgain(): void {
        this.gameState.startGame()
    }
}
