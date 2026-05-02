# Visual Problem Solving Engine

Brilliant-style **scene-based lessons**: learners manipulate visuals first, then lock understanding with checks, feedback, and optional mastery persistence.

This document describes the implementation in **MindOrbit Learn** (Next.js app + shared content + Prisma).

---

## Product rules

1. **Visual-first** — Each scene has a workspace, interaction, validation, and feedback that references what the learner did.
2. **70% visual rule** — For any generated or validated `VisualLesson`, at least **70%** of steps (regular `scenes` + `finalMasteryCheck`) must **not** be plain choice-only steps (`multiple_choice`, `true_false`). Enforced in `apps/web/src/lib/scene-registry.ts` (`lessonPassesVisualInteractionRule`, `visualInteractionRatio`) and `lesson-generator.ts` (`assertValidGeneratedLesson`).
3. **No passive-only paths** — Curricula should mix shading, dragging, placing points, ordering, connecting nodes, etc.; MC is allowed but not as the only modality.

---

## Scene type categories (product taxonomy)

Rough targets from curriculum design (counts are **guidance**, not enforced in code):

| Category | Role | Target # of scene *kinds* | MindOrbit today |
|----------|------|---------------------------|-----------------|
| **1. Selection** | Recognition, basic understanding — tap regions, multi-select, highlights, binary choice | 3–5 | `multiple_choice`, `true_false`, `venn_two`, `segment_select` |
| **2. Construction / manipulation** | Core “thinking” — drag, build models, reorder, connect, sliders, fill containers | 5–7 | `fraction_bar`, `grid_model`, `drag_drop_sort`, `concept_map`, `slider` |
| **3. Spatial placement** | Exact position in space — number line, graph, alignments | 3–5 | `number_line`, `graph_plot` |
| **4. Input-based** | Typed answers **after** visual work | 2–4 | *Not implemented yet* (e.g. numeric / equation / short text) |
| **5. Simulation / dynamic** | Change variables → observe outcome | 2–3 | *Not implemented yet* |
| **6. Multi-step / hybrid** | Drag → plot → answer in one flow | 3–5 | **Lesson-level**: sequence multiple `Scene`s; no single `SceneType` yet |

TypeScript: `SceneCategory` lists all six buckets; `sceneCategoryForType()` in `apps/web/src/types/scene.ts` returns **`selection` \| `construction` \| `spatial`** for each current **`SceneType`**. **`hybrid`** is lesson composition only; **`input`** / **`simulation`** are reserved for future scene kinds.

---

## Architecture

```text
VisualLesson (JSON)
  └── Scene[] + finalMasteryCheck
        └── SceneRenderer → primitive by scene.type
        └── userInput (Zustand + local state)
        └── POST /api/submit-scene → validation-engine → feedback-engine → mastery-engine (+ Prisma)
```

| Layer | Responsibility |
|--------|------------------|
| **Lesson** | Title, subject/topic/level, ordered scenes + final mastery scene |
| **Scene** | Prompt, `data`, `interaction`, `validation`, `feedback`, `masteryTarget` |
| **Primitives** | SVG / DOM widgets (`FractionBar`, `NumberLine`, …) |
| **Validation** | `validateScene(scene, userInput)` → `isCorrect` + detail |
| **Feedback** | Copy that cites the learner’s visual action (`feedback-engine.ts`) |
| **Mastery** | XP / `UserNodeState` / review queue (`mastery-engine.ts`) when API persists |

---

## TypeScript types

### Lesson (`apps/web/src/types/lesson.ts`)

- **`VisualLesson`** — `id`, `title`, `subject`, `topic`, `level` (`beginner` \| `intermediate` \| `advanced`), `scenes`, `finalMasteryCheck`.

### Scene (`apps/web/src/types/scene.ts`)

- **`SceneType`** — `fraction_bar` \| `number_line` \| `grid_model` \| `drag_drop_sort` \| `graph_plot` \| `concept_map` \| `multiple_choice` \| `slider` \| `venn_two` \| `true_false` \| `segment_select`
- **`SceneCategory`** — `selection` \| `construction` \| `spatial` \| `input` \| `simulation` \| `hybrid` (see **Scene type categories**; `sceneCategoryForType` only returns the first three until more kinds exist)
- **`SceneInteraction`** — `tap_to_fill` \| `drag_to_place` \| `reorder` \| `place_point` \| `connect_nodes` \| `select_choice`
- **`ValidationRule`** — discriminated union: `exact_selection`, `count_match`, `ordered_sequence`, `point_match`, `choice_match`
- **`Scene`** — Full per-step payload including `data: Record<string, unknown>` (primitive-specific).

Zod mirrors TS in `apps/web/src/lib/scene-schema.ts` and `lesson-schema.ts`.

---

## Repository layout

| Area | Path |
|------|------|
| **Pages** | `apps/web/src/app/(app)/learn/page.tsx`, `lesson/[lessonId]/page.tsx` |
| **API** | `apps/web/src/app/api/generate-lesson/route.ts`, `submit-scene/route.ts`, `progress/route.ts` |
| **Player & scenes** | `apps/web/src/components/lesson/*`, `components/primitives/*`, `components/ui/*` |
| **Engines & helpers** | `apps/web/src/lib/validation-engine.ts`, `feedback-engine.ts`, `mastery-engine.ts`, `lesson-helpers.ts`, `load-visual-lesson.ts`, `subject-resolve.ts`, `scene-registry.ts`, `lesson-generator.ts`, `seed-lessons.ts` |
| **Client state** | `apps/web/src/store/lesson-store.ts` |
| **Canonical lesson JSON** | `packages/content/src/visual-engine-*.ts` + **`visual-engine-seed-catalog.ts`** (`VISUAL_ENGINE_LESSON_SEEDS`) |
| **Prisma** | `packages/db/prisma/schema.prisma` — `SceneLesson`, `SceneAttempt`, `LessonAttempt`; seed loop in `packages/db/prisma/seed.ts` |

---

## User flows

### Browse lessons

- **`/learn`** — Groups cards by **subject** (seed `subject`; DB rows use `Subject.title`, with Algebra / Geometry / SAT Math grouped under **Math**).
- **`/lesson/[lessonId]`** — Loads `SceneLesson` from DB if present, else falls back to **seed** JSON by `lessonId` (`load-visual-lesson.ts`).

### Play a lesson (`LessonPlayer.tsx`)

- One scene at a time; **Progress** bar; **Check** calls **`POST /api/submit-scene`** (session user; no client-forged `userId`).
- **Skip scene** — Advances without API (no grade/mastery for that step). On the last scene, advances to completion UI.

---

## HTTP API

### `POST /api/generate-lesson`

- **Auth:** Session required.
- **Body:** `{ subject, topic, level }`.
- **Behavior:** Resolves subject FK, upserts `SceneLesson`, returns `{ lesson, sceneLessonId }`. Today uses **`generateOrRejectLesson`** with curated seeds when the model stub returns null.

### `POST /api/submit-scene`

- **Auth:** Session required.
- **Body:** `{ lessonId, sceneId, userInput }`.
- **Response:** `{ isCorrect, feedback, misconception?, visualCorrection?, masteryUpdate, nextScene?, completedLesson? }`.
- Persists **`SceneAttempt`** when a DB `SceneLesson` row exists; runs mastery side effects when `subjectId` can be resolved.

### `GET /api/progress`

- **Auth:** Session required.
- Aggregates user progress snapshot (mastery, confidence, completed lesson attempts, weak concepts, review queue, XP).

---

## Database

| Model | Role |
|--------|------|
| **`SceneLesson`** | `lessonJson` stores full `VisualLesson`; optional `userId`, `subjectId`, `topic`, `level`, `title` |
| **`SceneAttempt`** | Per-step try: `userInputJson`, `isCorrect`, `feedback`, etc. |
| **`LessonAttempt`** | Created when learner completes final scene correctly (deduped per user/lesson) |

**Local dev:** If migrations were never baselined, use `yarn prisma db push --schema=./packages/db/prisma/schema.prisma` so tables exist. **`yarn db:seed`** upserts all `VISUAL_ENGINE_LESSON_SEEDS`.

---

## Adding a new seed lesson

1. Add a new file under **`packages/content/src/`** (e.g. `visual-engine-mytopic-lesson.ts`) exporting a `*LESSON_SEED` object matching the Zod/`VisualLesson` shape.
2. Register it in **`packages/content/src/visual-engine-seed-catalog.ts`** (`VISUAL_ENGINE_LESSON_SEEDS`).
3. Re-export from **`packages/content/src/index.ts`** if you want a direct package export (optional; catalog re-export is enough for seeds).
4. **`subjectSlugForVisualLessonSeed`** — Ensure `subject` string maps to an existing `Subject.slug` (e.g. `Chemistry` → `chemistry`; default math-related slugs map to **algebra** for FK).
5. Run **`yarn workspace @mindorbit/content build`** (or turbo) and **`yarn db:seed`** to refresh DB rows.

---

## Adding a new scene type

1. Extend **`SceneType`** and **`SceneInteraction`** in `apps/web/src/types/scene.ts`.
2. Extend Zod in **`scene-schema.ts`**.
3. Update **`scene-registry.ts`** (`DEFAULT_INTERACTION`, `VISUAL_SCENE_TYPES`, `NON_MANIPULATION_SCENE_TYPES` if the step is choice-only).
4. Add a primitive under **`apps/web/src/components/primitives/`**.
5. Branch in **`SceneRenderer.tsx`** and map `userInput` fields expected by **`validation-engine.ts`**.
6. Extend **`describeVisualAction`** (and misconception handling if needed) in **`feedback-engine.ts`**.

---

## LLM / generation

- System prompt constant: **`VISUAL_LESSON_SYSTEM_PROMPT`** in `apps/web/src/lib/lesson-generator.ts`.
- **`generateLessonFromModel`** is a stub; wire a provider and parse JSON through **`assertValidGeneratedLesson`** so the 70% rule applies.

---

## Related files (quick index)

- Types: `apps/web/src/types/scene.ts`, `lesson.ts`, `progress.ts`
- Mastery resolution: `apps/web/src/lib/mastery-engine.ts` (`resolveConceptNodeId` accepts **slug or cuid** when `subjectId` is known)
- Learn grouping: `apps/web/src/app/(app)/learn/page.tsx` (`subjectGroupFromDb`)

For questions or changes, search the repo for **`VISUAL_ENGINE_LESSON_SEEDS`** or **`SceneLesson`** to find all touchpoints.
