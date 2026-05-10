# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A fill-in-the-blank vocabulary game using real Myanmar (Burmese) words. Players complete words by choosing the correct prefix or suffix from 4 options. 3 lives, infinite rounds, streak bonuses, leaderboard.

**Current state:** Angular frontend is fully built and functional (`web/`). The .NET backend (`api/`) and database (`db/migrations/`) do not exist yet. The frontend runs entirely offline using `web/src/assets/questions.json` (~3,795 questions); leaderboard is persisted to `localStorage`.

---

## Tech Stack

| Layer    | Technology                               |
|----------|------------------------------------------|
| Frontend | Angular 17, Tailwind CSS (built)         |
| Backend  | .NET 8 Web API (not yet built)           |
| Database | SQL Server, Dapper (no EF) (not yet built) |
| Testing  | xUnit + Moq (.NET), Jasmine/Karma (Angular) |
| Infra    | Docker Compose (local), AWS ECS + RDS    |

---

## Commands

### Frontend (exists)
```bash
cd web
npm install
npm start          # http://localhost:4200
npm test           # Karma/Jasmine
```

### API (not yet built)
```bash
cd api
dotnet build
dotnet run --project src/MyanmarWordGame.Api   # http://localhost:5000
dotnet test
dotnet test --filter "FullyQualifiedName~QuestionServiceTests"
```

### Docker (not yet built)
```bash
docker-compose up -d
docker-compose logs -f api
```

### Database (not yet built)
```bash
sqlcmd -S localhost -d MyanmarWordGame -i db/migrations/001_create_questions.sql
```

---

## Architecture

### Frontend (`web/src/app/`)

```
core/
  models/question.model.ts      — Question, LeaderboardEntry interfaces
  services/
    game-state.service.ts       — central game state (lives, score, streak, currentQuestion) via signals
    question.service.ts         — loads assets/questions.json, manages shuffled pool
    leaderboard.service.ts      — localStorage CRUD, top-10 only
features/
  home/                         — start screen, shows top leaderboard entry
  game/                         — main gameplay, delegates all logic to GameStateService
    choice-button/              — stateless button component, computes CSS from @Input state
  game-over/                    — score display + name entry → LeaderboardService.addEntry()
  leaderboard/                  — read + clear entries from LeaderboardService
```

`GameStateService` is the single source of truth for active game state. Components call its methods (`startGame`, `submitAnswer`, `nextQuestion`) and read its signals — no direct service-to-service calls from components.

`QuestionService` holds a shuffled pool in memory; when exhausted it reshuffles all questions and starts over (infinite rounds). Questions are loaded once from `assets/questions.json` and cached for the session.

`LeaderboardService` currently has no API dependency — everything is `localStorage`. When the backend is built, this service is the only place that needs to change.

### Backend (planned)

Controllers → Services → Repositories → SQL Server

- Controllers: validate input, call service, return HTTP — nothing else
- Services: all business logic, call repositories only
- Repositories: all DB access via Dapper, return domain models — no logic

---

## Domain Model

### Question
```
mode:    "prefix" | "suffix"
base:    string   — the known part of the word
correct: string   — the correct completion
choices: string[] — 4 options (correct shuffled in)
```

**Suffix:** `base + ___` → player fills the ending  
**Prefix:** `___ + base` → player fills the beginning

Questions are compound word pairs where a base word has 3+ valid prefix or suffix extensions.

### Game Session
- 3 lives — wrong answer costs 1 life
- Score: +10 correct + (streak × 2) bonus; streak resets on wrong answer
- Pool reshuffles when exhausted (infinite rounds)

---

## API Contract

```
GET  /api/v1/questions?count=10&mode=random   → Question[]
GET  /api/v1/questions/random                 → Question
POST /api/v1/sessions                         → create session
PUT  /api/v1/sessions/{id}/answer             → submit answer
GET  /api/v1/leaderboard?top=10               → LeaderboardEntry[]
POST /api/v1/leaderboard                      → submit score
```

---

## Code Style

### TypeScript / Angular
- `inject()` over constructor injection; signals over Subjects for local state
- Standalone components — no NgModules
- No `any` — always type explicitly
- No semicolons; 4-space indent; trailing commas allowed
- Add `class="myanmar-text"` to any element displaying Myanmar script — it sets `font-family: 'Noto Sans Myanmar'` and `line-height: 1.8`

### C# / .NET
- `_camelCase` private fields; PascalCase everything else
- 4-space indent

### SQL
- snake_case tables and columns; prefix tables with `game_` (e.g. `game_questions`)
- Parameterized queries only — no string interpolation

### Schema reference
```sql
CREATE TABLE game_questions (
    id         INT IDENTITY PRIMARY KEY,
    mode       NVARCHAR(10)  NOT NULL,   -- 'prefix' | 'suffix'
    base_word  NVARCHAR(100) NOT NULL,
    correct    NVARCHAR(100) NOT NULL,
    choice_1   NVARCHAR(100) NOT NULL,
    choice_2   NVARCHAR(100) NOT NULL,
    choice_3   NVARCHAR(100) NOT NULL,
    choice_4   NVARCHAR(100) NOT NULL,
    created_at DATETIME2     DEFAULT GETDATE()
);
```

---

## Environment Variables

```
# API
ASPNETCORE_ENVIRONMENT=Development
DB_CONNECTION_STRING=Server=localhost;Database=MyanmarWordGame;...
CORS_ORIGINS=http://localhost:4200

# Frontend (Angular environments file, not Vite)
API_BASE_URL=http://localhost:5000
```

Never hardcode — use `.env` (not committed) or AWS Secrets Manager in production.

---

## Data Source

`MMWords.txt` — 32,884 Myanmar words, one per line, alphabetically sorted. Question generation logic: find base words that share 3+ valid prefix or suffix extensions and use those extensions as the 4 choices. The generated question bank (`web/src/assets/questions.json`, ~3,795 questions) serves as the offline fallback; SQL Server serves them dynamically in production.
