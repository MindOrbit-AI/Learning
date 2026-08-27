# Adding a Math Curriculum Track

This guide explains how to add a new **multi-level math curriculum** (e.g. Fractions, Percents, Proportional Reasoning) to MindOrbit Learn. Each track is a folder of **lesson seeds** that become playable lessons at `/lesson/[id]` and browsable cards at `/interactives`.

For the underlying scene engine (primitives, validation, Zod schemas), see [visual-problem-engine.md](./visual-problem-engine.md).

---

## Overview

A curriculum track flows through four layers:

```text
1. Content seeds          packages/content/src/math-<track>/
2. Global seed catalog    packages/content/src/visual-engine-seed-catalog.ts
3. Marketing catalog      apps/web/src/features/marketing/interactives/
4. Database (optional)    yarn db:seed → SceneLesson rows
```

**Existing tracks** (use as references):

| Track | Folder | Topic prefix | Lesson id prefix |
|-------|--------|--------------|------------------|
| Fractions | `math-fractions/` | `Fractions (Level N)` | `lesson-fractions-l{n}-…` |
| Algebra | `math-algebra/` | `Algebra (Level N)` | `lesson-algebra-l{n}-…` |
| Negative numbers | `math-integers/` | `Negative Numbers (Level N)` | `lesson-integers-l{n}-…` |
| Coordinate plane | `math-coordinate-plane/` | `Coordinate Plane (Level N)` | `lesson-coord-l{n}-…` |
| Percents | `math-percents/` | `Percents (Level N)` | `lesson-percents-l{n}-…` |
| Proportional reasoning | `math-proportional-reasoning/` | `Proportional Reasoning (Level N)` | `lesson-prop-l{n}-…` |

---

## Step 1 — Create the content folder

Create `packages/content/src/math-<track>/` with this layout:

```text
math-<track>/
  _helpers.ts      # Types, scene builders, reusable lesson generators
  level-1.ts       # Lessons for level 1
  level-2.ts
  …
  index.ts         # Aggregates all levels into MATH_<TRACK>_CURRICULUM_SEEDS
```

### Naming conventions

| Item | Convention | Example |
|------|------------|---------|
| Folder | `math-<kebab-case-topic>` | `math-proportional-reasoning` |
| Export constant | `MATH_<SCREAMING_SNAKE>_CURRICULUM_SEEDS` | `MATH_PROP_CURRICULUM_SEEDS` |
| Topic label | `{Display Name} (Level N)` | `Proportional Reasoning (Level 3)` |
| Lesson id | `lesson-<short>-l{level}-{slug}` | `lesson-prop-l3-finding-the-total` |
| Slug | kebab-case from title | `finding-the-total` |
| Concept node | stable slug for mastery | `proportional-reasoning` |

The **topic string** is what groups lessons by level in the interactives UI. It must match the regex used in `catalog.ts`:

```ts
/^(?:Fractions|Algebra|Negative Numbers|Coordinate Plane|Percents|Proportional Reasoning) \(Level (\d+)\)$/
```

When you add a new track, extend this regex and the related helpers (see Step 4).

---

## Step 2 — Build `_helpers.ts`

Define types and factory functions. Copy an existing track that uses similar scene types (e.g. `math-percents/_helpers.ts` for MC + grids, `math-coordinate-plane/_helpers.ts` for graphs).

### Required types

```ts
export type TrackDifficulty = "beginner" | "intermediate";

export type TrackSceneSeed = {
  id: string;
  title: string;
  type: /* SceneType subset */;
  prompt: string;           // required — Zod fails without this
  visualPrompt: string;
  data: Record<string, unknown>;
  interaction: /* SceneInteraction */;
  validation: Record<string, unknown> & { type: string };
  feedback: { correct: string; incorrect: string; hint?: string };
  masteryTarget: { conceptNodeId: string; skill: string };
};

export type TrackLevel = 1 | 2 | /* … */;

export type TrackLessonSeed = {
  id: string;
  title: string;
  subject: "Math";
  topic: string;              // e.g. "Percents (Level 2)"
  level: TrackDifficulty;
  <track>TrackLevel: TrackLevel;  // metadata for catalog only
  scenes: TrackSceneSeed[];
  finalMasteryCheck: TrackSceneSeed;
};
```

### Core helpers

Every track typically implements:

- `topicForLevel(n)` — returns `"{Track Name} (Level N)"`
- `lessonId(level, slug)` — stable URL id
- `lesson(...)` — wraps scenes + final mastery into a seed
- `mcScene`, `matchScene`, `sortScene`, … — one function per scene type you use

### Reusable lesson generators

For repetitive patterns (percent-of, plot-a-point, scale-a-ratio), add generators like `percentOfLesson()` or `plotPointLesson()` that return a full `TrackLessonSeed` with 3 scenes + mastery check. Use these in `level-*.ts` to keep level files short.

### Lesson shape rules

Each lesson must have:

1. **3 regular scenes** (typical) in `scenes`
2. **1 `finalMasteryCheck`** scene
3. Every scene needs a **string `prompt`** and **`feedback.correct`**
4. For `multiple_choice`, pass choices in `data.choices` — not as the prompt argument

**70% visual rule:** At least 70% of steps (scenes + final check) must **not** be plain choice-only (`multiple_choice`, `true_false`, `segment_select`). Mix in `fraction_bar`, `grid_model`, `number_line`, `graph_plot`, `drag_drop_sort`, `drag_drop_match`, etc. See `apps/web/src/lib/scene-registry.ts`.

### Scene type → validation quick reference

| Scene type | Interaction | Validation type | Key `data` fields |
|------------|-------------|-----------------|-------------------|
| `multiple_choice` | `select_choice` | `choice_match` | `choices: string[]`, `expectedChoice` |
| `fraction_bar` / `grid_model` | `tap_to_fill` | `count_match` | `totalParts` or `rows`/`columns`, `expectedCount` |
| `number_line` | `place_point` | `point_match` | `min`, `max`, `step`; `expectedPoint: { x, y }` |
| `graph_plot` | `place_point` | `point_match` | `xMin`/`xMax`/`yMin`/`yMax`, optional `lines` |
| `drag_drop_match` | `drag_to_place` | `slot_match` | `items`, `slots`, `expected: Record<slotId, itemId>` |
| `drag_drop_sort` | `reorder` | `ordered_sequence` | `items`, `expectedOrder` (all items) |

---

## Step 3 — Write level files

Each `level-N.ts` exports an array of seeds:

```ts
import { ratioSetupLesson, levelReviewLesson } from "./_helpers";

/** Level 1 — Setting up ratios */
export const MATH_PROP_LEVEL_1_SEEDS = [
  ratioSetupLesson(1, "setting-up-ratios", "Setting Up Ratios", 2, 3, "Paint mix"),
  levelReviewLesson(1, "level-check", "Level Check", [
    { prompt: "…", choices: ["…"], answer: "…" },
    // 4 questions: first 3 → scenes, 4th → final mastery
  ]),
];
```

End each level with a **Level Check** review lesson when the curriculum spec includes one.

### `index.ts`

```ts
import { MATH_PROP_LEVEL_1_SEEDS } from "./level-1";
// …

export const MATH_<TRACK>_CURRICULUM_SEEDS: TrackLessonSeed[] = [
  ...MATH_PROP_LEVEL_1_SEEDS,
  // …
];

export const MATH_<TRACK>_CURRICULUM_COUNT = MATH_<TRACK>_CURRICULUM_SEEDS.length;
```

Prefer **named exports** for seeds in `packages/content/src/index.ts` to avoid `export *` name collisions between tracks (`mcScene`, `lesson`, etc.):

```ts
export {
  MATH_<TRACK>_CURRICULUM_SEEDS,
  MATH_<TRACK>_CURRICULUM_COUNT,
} from "./math-<track>";
export type { TrackLessonSeed } from "./math-<track>/_helpers";
```

---

## Step 4 — Register in the seed catalog

Add the spread to `packages/content/src/visual-engine-seed-catalog.ts`:

```ts
import { MATH_<TRACK>_CURRICULUM_SEEDS } from "./math-<track>";

export const VISUAL_ENGINE_LESSON_SEEDS = [
  // …existing seeds
  ...MATH_<TRACK>_CURRICULUM_SEEDS,
] as const;
```

This wires lessons into:

- `yarn db:seed` (Prisma upsert)
- `apps/web/src/lib/seed-lessons.ts` (Zod parse at startup)
- `/learn` fallback when DB row missing

---

## Step 5 — Marketing catalog (`/interactives`)

### 5a. Track-specific catalog file

Create `apps/web/src/features/marketing/interactives/<track>-catalog.ts` (copy `percents-catalog.ts` or `integers-catalog.ts`):

- Map scene types → `EnginePrimitive[]` (`tiles`, `graph`, `number_line`, …)
- Map scene types → `SceneCategory[]` (`construction`, `selection`, `spatial`)
- `build<Track>CatalogItems(seeds)` → `InteractiveCatalogItem[]`
- Per-level accent colors and a Lucide icon

### 5b. Wire `catalog.ts`

1. Import seeds and `build<Track>CatalogItems`
2. Spread into `INTERACTIVE_CATALOG`:
   ```ts
   ...build<Track>CatalogItems(MATH_<TRACK>_CURRICULUM_SEEDS),
   ```
3. Add to `MathTrackFilter`:
   ```ts
   export type MathTrackFilter = "All" | … | "<TrackKey>" | "Featured";
   ```
4. Add `MATH_TRACK_META.<TrackKey>` (label, description, accent, border)
5. Add `LEVEL_THEMES` record (level number → theme string)
6. Add `is<Track>CurriculumItem()` — `item.topic.startsWith("{Track Name} (Level")`
7. Update `isFeaturedMathItem()` to exclude the new track
8. Update `interactivesForMathTrack()`
9. Update `curriculumLevelFromTopic()` regex
10. Add to `CurriculumTrack` type and `filterByCurriculumLevel()` prefix map
11. Update `levelThemeForItem()`, `levelOptionsForTrack()`, `curriculumThemesForTrack()`, `curriculumTrackBadge()`

### 5c. Wire `interactives-landing.tsx`

- Import `LEVEL_THEMES` for the new track
- Add track card in `MathTrackPicker` (`id`, label, description, count)
- Add to `MathTrackOverview` previews
- Include track in `showLevelSelect` and `filterByCurriculumLevel` conditions
- Adjust grid columns if needed (`2xl:grid-cols-N`)

---

## Step 6 — Validate locally

Run with **Node 18+** (Node 12 breaks `tsc` / content builds):

```bash
# Quick scene sanity check (from repo root)
npx tsx -e "
import { MATH_<TRACK>_CURRICULUM_SEEDS } from './packages/content/src/math-<track>/index.ts';
let bad = 0;
for (const lesson of MATH_<TRACK>_CURRICULUM_SEEDS) {
  for (const scene of [...lesson.scenes, lesson.finalMasteryCheck]) {
    if (!scene.prompt || !scene.feedback?.correct) bad++;
  }
}
console.log('Lessons:', MATH_<TRACK>_CURRICULUM_SEEDS.length);
console.log('Malformed scenes:', bad);
"
```

```bash
# Full Zod parse (all seeds)
yarn workspace @mindorbit/content build   # optional; fixes @mindorbit/content type exports
# Dev server parses seeds via seed-lessons.ts on load
yarn dev
```

Spot-check URLs:

```text
/lesson/lesson-<short>-l1-<first-lesson-slug>
/interactives   → Math → your track → Level 1
```

Load into the database:

```bash
yarn db:seed
```

---

## Checklist

Use this when adding a track named **Example Track** (`math-example`):

- [ ] `packages/content/src/math-example/_helpers.ts`
- [ ] `packages/content/src/math-example/level-*.ts` (one file per level)
- [ ] `packages/content/src/math-example/index.ts` → `MATH_EXAMPLE_CURRICULUM_SEEDS`
- [ ] `packages/content/src/index.ts` — named export
- [ ] `packages/content/src/visual-engine-seed-catalog.ts` — spread seeds
- [ ] `apps/web/src/features/marketing/interactives/example-catalog.ts`
- [ ] `apps/web/src/features/marketing/interactives/catalog.ts` — full wiring
- [ ] `apps/web/src/features/marketing/interactives/interactives-landing.tsx` — track card + filters
- [ ] Scene validation script passes (0 malformed)
- [ ] ≥70% non-MC scenes per lesson (visual rule)
- [ ] `yarn db:seed` run locally
- [ ] Manual smoke test: `/lesson/…` and `/interactives`

---

## Tips

**Copy the closest existing track.** Algebra for equation-heavy content; integers for number lines; coordinate plane or proportional reasoning for `graph_plot`; percents for bar/grid percentage models.

**Keep slugs stable.** Lesson ids appear in URLs and the DB; changing them orphans old links.

**Level checks.** Use `levelReviewLesson()` with 4 MC questions — scenes 1–3 from the first three, final mastery from the fourth.

**Avoid `export *` from `_helpers` in `index.ts`** unless you are sure helper names do not collide across tracks. The content package DTS build fails on duplicate exports (`mcScene`, `lesson`, …).

**Subject FK on seed.** Math lessons use `subject: "Math"`. `subjectSlugForVisualLessonSeed()` maps that to the `algebra` subject slug for Prisma FKs — no extra config needed.

---

## Related docs

- [Visual Problem Engine](./visual-problem-engine.md) — scene types, validation, API, single-lesson seeds
- [Product loop](./product-loop.md) — learner journey (if extending `/learn` grouping)
