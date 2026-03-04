**Live demo**: [cleanstart-chi.vercel.app](https://cleanstart-chi.vercel.app/)  
**Repository**: [github.com/vishnu-priya-27/cleanstart](https://github.com/vishnu-priya-27/cleanstart)
**Quickstart**: create Supabase project → run `supabase-schema.sql` → set `.env.local` → `npm install` → `npm run dev`

# CleanStart - Startup Simulation Game

A single-player, turn-based startup simulation inspired by the MIT CleanStart game. Each turn represents one business quarter. You set pricing, hiring, and compensation; the server runs the model; results persist and render on a dashboard.

## Deliverables / Scope

- **Built**: email/password auth (Supabase), server-authoritative quarterly simulation, persisted game state + history, dashboard (last 4 quarters), office visualization, win/lose states.
- **Cut (intentional)**: multi-player, AI competitors, complex market dynamics, admin tools, and data export—kept scope to one complete vertical slice.
- **Known tradeoffs**: the model is intentionally simplified (per prompt). UI focuses on clarity over exhaustive controls/customization.

## Setup

### 1. Create Supabase project + schema

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication > Providers** and ensure **Email** is enabled
4. *(Optional for development)* Under **Authentication > Settings**, disable "Confirm email" so new accounts can log in immediately

If you created your tables using an older schema, run this migration:

```sql
alter table public.games
  add column if not exists quality numeric not null default 50;
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from your Supabase project settings (Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & run (≤ 5 commands)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Play

- **Starting conditions**: $1M cash, 4 engineers, 2 sales staff, product quality 50/100
- **Each quarter** you decide: unit price, hiring, and salary level
- **Goal**: Survive 40 quarters (10 years) with positive cash
- If cash hits zero, you lose
- If you reach Year 10 with positive cash, you win and see cumulative profit

### Decision Levers

| Decision | Range | Effect |
|----------|-------|--------|
| Unit Price | $50 – $5,000 | Higher price increases revenue per unit but reduces demand |
| Hire Engineers | 0 – 20 | Engineers increase product quality each quarter (cap 100) |
| Hire Sales | 0 – 20 | Sales staff increase units sold (linear in this simplified model) |
| Salary % | 50% – 150% | Directly scales payroll cost (industry avg is $30k/quarter) |

## Simulation Model (server-side)

The simulation runs **only on the server** (Next.js API routes). Clients submit decisions; they do not compute outcomes.

Per quarter:

- **Payroll/person**: \((salary\_pct / 100) * 30{,}000\)
- **Total payroll**: payroll/person * (engineers + sales_staff)
- **Quality**: quality += engineers * 0.5 (cap 100)
- **Demand**: max(0, quality * 10 - price * 0.0001)
- **Units sold**: floor(demand * sales_staff * 0.5)
- **Revenue**: price * units
- **Net income**: revenue - total_payroll
- **Hiring cost**: (new_engineers + new_sales) * 5,000 (one-time)
- **Cash end**: cash + net_income - hiring_cost

## Architecture overview

- **UI**: `src/app/page.tsx` (auth) and `src/app/game/page.tsx` (game screen) with components in `src/components/`.
- **Auth/session**: `src/middleware.ts` guards `/game` and redirects based on session.
- **API (server)**:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/game/load`
  - `POST /api/game/new`
  - `POST /api/game/advance`
- **Simulation engine**: `src/lib/simulation.ts`
- **Supabase clients**:
  - browser: `src/lib/supabase-browser.ts`
  - server: `src/lib/supabase-server.ts` (cookie-backed)

## Data model (Supabase)

- `games`: one active game per user (plus past games), stores current quarter/cash/headcount/quality/status and cumulative totals.
- `game_turns`: immutable per-quarter history (inputs + outputs).
- RLS is enabled and policies restrict access to a user's own rows.

## Deployment (optional)

Deploy on Vercel and set the same env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Development notes

- `npm run build` creates a production build.
- `npm run lint` runs ESLint (non-interactive).

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Recharts
- **Backend**: Next.js API Routes, server-side simulation engine
- **Database**: Supabase (PostgreSQL + Auth + RLS)
