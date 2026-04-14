# MindOrbit Learn

A **Cognitive Mastery Network** for students—diagnostic-first learning with mastery maps, AI-generated missions, and community notes.

## Overview

MindOrbit Learn combines:

- **Diagnostic engine** – 5-minute assessments to map mastery
- **Mastery map** – Interactive concept graph with node states
- **Learning missions** – AI-generated study paths for weak nodes
- **Community notes** – Node-linked resources from students
- **Spaced repetition** – Review queue for reinforcement

## Tech Stack

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn-style UI
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js (credentials)
- **Graph**: React Flow for mastery map
- **Charts**: Recharts
- **State**: Zustand, React Query

## Project Structure

```
├── apps/
│   └── web/                 # Next.js app
├── packages/
│   ├── config/             # ESLint, TypeScript configs
│   ├── db/                 # Prisma schema, client, seed
│   ├── types/              # Shared domain types
│   ├── lib/                # Utilities, constants
│   ├── content/            # Subject graphs, seed content
│   ├── ai/                 # AI interfaces, mock provider
│   └── ui/                 # Shared UI components
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Local Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment

Copy `.env.example` to `.env` and set:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mindorbit_learn?schema=public"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database

```bash
pnpm db:push
pnpm db:seed
```

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production database (Vercel & Supabase)

Vercel does not execute Prisma CLI commands for you. To reset or migrate a **hosted** database, run the root scripts **on your machine** (or in CI) with `DATABASE_URL` pointing at that database.

### Environment

1. In the Vercel project, add **`DATABASE_URL`** for the **Production** environment (and Preview if needed). Use the connection string from your host (for Supabase: **Project settings → Database**).
2. Pull variables locally when you need to run destructive or migration commands against production:

   ```bash
   cd apps/web
   npx vercel env pull ../../.env.production.local --environment production --yes
   ```

   Ensure `.env.production.local` is gitignored and never committed.

### Reset production data (`db:reset`)

`db:reset` runs `prisma db push --force-reset` (drops data) and then seeds. **Use only when you intend to wipe the remote database.**

From the **repository root**:

```bash
npx dotenv-cli -e .env.production.local -- pnpm db:reset
```

### Supabase: direct URL vs pooler

Supabase exposes:

- **Session pooler** (often host `*.pooler.supabase.com`, port **6543**) — good for app traffic.
- **Direct connection** (host `db.<project-ref>.supabase.co`, port **5432**) — use this for **Prisma `db push`, `migrate`, and `db reset`**. DDL and long transactions can stall or fail through the pooler.

Put the **direct** URI in `DATABASE_URL` when running CLI operations against production.

## Demo Account

- **Email**: demo@mindorbit.learn
- **Password**: demo1234

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint |
| `pnpm db:push` | Push Prisma schema |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test` | Run all tests |
| `pnpm test:unit` | Unit tests (Vitest) |
| `pnpm test:e2e` | E2E tests (Playwright) |

## Features

### Implemented

- Email/password auth + signup
- Onboarding (grade, goals, subjects)
- Subject explorer (Algebra, Chemistry, SAT Math)
- 5-minute diagnostic with scoring
- Node state assignment (mastered/weak/missing)
- Mastery map (React Flow, graph + list view)
- Mission generation for weak nodes
- Mission practice with feedback
- Community resource feed
- Resource like/save
- Resource upload
- Creator profiles
- Review queue
- Global search
- Dashboard with stats
- XP and badges

### Seeded Content

- 3 subjects: Algebra, Chemistry, SAT Math
- Clusters and concept nodes per subject
- Prerequisite edges
- Diagnostic questions
- Badges
- Demo user + sample resources

## License

Private.
