import { Routes } from '@angular/router'

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'game',
        loadComponent: () =>
            import('./features/game/game.component').then(m => m.GameComponent),
    },
    {
        path: 'game-over',
        loadComponent: () =>
            import('./features/game-over/game-over.component').then(m => m.GameOverComponent),
    },
    {
        path: 'leaderboard',
        loadComponent: () =>
            import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent),
    },
    {
        path: '**',
        redirectTo: '',
    },
]
