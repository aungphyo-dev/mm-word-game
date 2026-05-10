import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { DatePipe, NgFor } from '@angular/common'
import { LeaderboardService } from '../../core/services/leaderboard.service'
import { LeaderboardEntry } from '../../core/models/question.model'

@Component({
    selector: 'app-leaderboard',
    standalone: true,
    imports: [RouterLink, DatePipe, NgFor],
    template: `
        <div class="min-h-screen bg-slate-50 p-4">
            <div class="max-w-sm mx-auto">

                <div class="flex items-center justify-between mb-6 pt-4">
                    <a routerLink="/" class="text-slate-500 hover:text-slate-700 text-sm myanmar-text">← ပြန်သွားမည်</a>
                    <h1 class="text-lg font-bold text-slate-800 myanmar-text">အမြင့်ဆုံးမှတ်များ</h1>
                    <button
                        (click)="confirmClear()"
                        class="text-red-400 hover:text-red-600 text-xs myanmar-text"
                    >ဖျက်မည်</button>
                </div>

                @if (entries().length === 0) {
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
                        <p class="text-slate-400 myanmar-text">မှတ်တမ်းမရှိသေးပါ</p>
                        <a routerLink="/" class="mt-4 inline-block text-sky-600 text-sm myanmar-text hover:underline">ကစားမည်</a>
                    </div>
                } @else {
                    <div class="space-y-2">
                        @for (entry of entries(); track entry.date; let i = $index) {
                            <div
                                class="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3"
                                [class.border-amber-300]="i === 0"
                                [class.bg-amber-50]="i === 0"
                            >
                                <span class="text-lg font-bold w-7 text-center"
                                    [class.text-amber-500]="i === 0"
                                    [class.text-slate-400]="i > 0"
                                >
                                    {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.' }}
                                </span>
                                <div class="flex-1 min-w-0">
                                    <p class="font-semibold text-slate-800 myanmar-text truncate">{{ entry.name }}</p>
                                    <p class="text-xs text-slate-400">{{ entry.date | date: 'dd MMM yyyy' }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-sky-600">{{ entry.score }}</p>
                                    <p class="text-xs text-orange-500 myanmar-text">🔥 {{ entry.streak }}</p>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    `,
})
export class LeaderboardComponent implements OnInit {
    private readonly leaderboardService = inject(LeaderboardService)
    entries = signal<LeaderboardEntry[]>([])

    ngOnInit(): void {
        this.entries.set(this.leaderboardService.getEntries())
    }

    confirmClear(): void {
        if (confirm('မှတ်တမ်းများ အားလုံးဖျက်မလား?')) {
            this.leaderboardService.clearEntries()
            this.entries.set([])
        }
    }
}
