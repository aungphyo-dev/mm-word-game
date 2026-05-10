import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { GameStateService } from '../../core/services/game-state.service'
import { LeaderboardService } from '../../core/services/leaderboard.service'
import { LeaderboardEntry } from '../../core/models/question.model'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-md border border-slate-100 p-8 max-w-sm w-full text-center">

                <div class="mb-2 text-5xl">📚</div>
                <h1 class="text-2xl font-bold text-slate-800 myanmar-text mb-1 leading-relaxed">
                    မြန်မာစကားလုံး
                </h1>
                <h2 class="text-xl font-semibold text-sky-600 myanmar-text mb-1">
                    ဖြည့်ဆွဲကစားနည်း
                </h2>
                <p class="text-sm text-slate-500 mb-8">Myanmar Word Completion Game</p>

                @if (topEntry()) {
                    <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm">
                        <span class="text-amber-600 font-semibold">🏆 အကောင်းဆုံး: </span>
                        <span class="text-slate-700 myanmar-text">{{ topEntry()!.name }}</span>
                        <span class="text-amber-700 font-bold ml-2">{{ topEntry()!.score }}</span>
                        <span class="text-slate-400 ml-1">မှတ်</span>
                    </div>
                }

                <div class="bg-slate-50 rounded-xl p-4 mb-6 text-left text-sm text-slate-600 space-y-1">
                    <p class="myanmar-text">❤️ အသက် ၃ ခု ရှိသည်</p>
                    <p class="myanmar-text">✅ မှန်တိုင်း +10 မှတ် + ဆက်တိုက် ဆု</p>
                    <p class="myanmar-text">🔥 ဆက်တိုက်မှန်က အမှတ်ထပ်ရသည်</p>
                </div>

                <button
                    (click)="startGame()"
                    class="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-4 rounded-xl transition-all text-lg myanmar-text mb-3 shadow-sm"
                >
                    ကစားမည်
                </button>

                <a
                    routerLink="/leaderboard"
                    class="w-full block bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all text-sm myanmar-text"
                >
                    အမြင့်ဆုံးမှတ်များ
                </a>
            </div>
        </div>
    `,
})
export class HomeComponent implements OnInit {
    private readonly gameState = inject(GameStateService)
    private readonly leaderboardService = inject(LeaderboardService)

    topEntry = signal<LeaderboardEntry | null>(null)

    ngOnInit(): void {
        const entries = this.leaderboardService.getEntries()
        this.topEntry.set(entries[0] ?? null)
    }

    startGame(): void {
        this.gameState.startGame()
    }
}
