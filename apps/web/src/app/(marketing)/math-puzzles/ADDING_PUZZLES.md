# Adding new puzzles

This guide explains how to add a new puzzle to the STEM arcade at
`apps/web/src/app/(marketing)/math-puzzles/page.tsx`.

Everything for one puzzle lives in three places in that single file:

1. The `PuzzleId` union (declares the identifier).
2. The `METAS` array (declares card metadata: title, subject, grade, XP gate, …).
3. The `makePuzzle` `switch` (declares the procedural generator).

All UI, filtering, progression, AI fallback, and persistence is wired off these
three things. You almost never need to edit anything else.

---

## 1. The 3-step recipe

### Step 1 — Add an id to the `PuzzleId` union

```typescript
type PuzzleId =
  | "weightScale"
  | "fractionPizza"
  // ...
  | "myNewPuzzle"; // ← add here
```

Use a stable, camelCase identifier. It is used as a React key, a
`localStorage` key prefix, and a switch label.

### Step 2 — Register card metadata in `METAS`

The `METAS` array drives the card grid, filters, skill tree, and unlock logic.
There are two builders:

- `m(...)` — base meta. Use for K-8 and Grade 9 math content with no special
  gating.
- `s(...)` — same as `m`, plus an optional `options` object for
  `xpRequired`, `prerequisites`, `isBoss`, `isMasteryTest`, `unlockMessage`,
  and `displayInteraction`.

```typescript
const METAS: PuzzleMeta[] = [
  // K-8 math (uses m, no XP gate):
  m("weightScale", "Weight Scale", "Solve hidden weights", "⚖️",
    "from-amber-400 to-orange-500", "K-8", "Algebra",
    "Solve for unknown weights", 2, "choice"),

  // Science/tech/engineering or gated content (uses s):
  s("dnaBasePair", "DNA Base Pair Match", "A-T, G-C", "🧬",
    "from-rose-300 to-fuchsia-700", "10", "Biology",
    "Pair DNA bases", 3, "match",
    { displayInteraction: "Matching cards", xpRequired: 80 }),
];
```

Argument-by-argument:

| Param              | Example                                | Notes                                                                                                            |
| ------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`               | `"myNewPuzzle"`                        | Must match the `PuzzleId` union.                                                                                 |
| `title`            | `"Weight Scale"`                       | Card title.                                                                                                      |
| `short`            | `"Solve hidden weights"`               | Sub-line under the title.                                                                                        |
| `emoji`            | `"⚖️"`                                  | Visual icon used in cards and most generators.                                                                   |
| `gradient`         | `"from-amber-400 to-orange-500"`       | Tailwind gradient classes for the card frame.                                                                    |
| `grade`            | `"K-8" \| "9" \| "10" \| "11" \| "12"` | Drives default XP gating.                                                                                        |
| `subject`          | `"Algebra"`                            | Must be in the `Subject` union. Domain (Math/Science/Technology/Engineering) is inferred via `domainFor`.        |
| `skill`            | `"Solve for unknown weights"`          | Shown in the card and skill-tree label.                                                                          |
| `estMin`           | `2`–`6`                                | Estimated minutes to solve.                                                                                      |
| `interactionHint`  | a `Mode` (see below)                   | Drives both the play UI and which AI mode is allowed.                                                            |
| `displayInteraction` | `"Multiple choice"`, `"Build with tiles"`, … | Optional, only on `s(...)`. Affects the **Interaction type** filter only; does not change runtime behavior. |
| `xpRequired`       | `80`                                   | Optional. Overrides the grade-based default.                                                                     |
| `prerequisites`    | `["dnaBasePair"]`                      | Optional. Other puzzles that must be completed first.                                                            |
| `isBoss`           | `true`                                 | Optional. Adds 300 XP to the default gate and marks it as a boss.                                                |
| `isMasteryTest`    | `true`                                 | Optional. Adds 500 XP to the default gate and marks it as a mastery test.                                        |
| `unlockMessage`    | `"Physics lab unlocked…"`              | Optional flavor text shown when the puzzle first unlocks.                                                        |

If you introduce a new `Subject`, also add it to the `Subject` union and (when
applicable) to `SCIENCE_SUBJECTS`, `TECH_SUBJECTS`, or `ENGINEERING_SUBJECTS`
so `domainFor` returns the correct domain.

### Step 3 — Add a `case` in `makePuzzle`

`makePuzzle(type, difficulty)` is one giant `switch` over `PuzzleId`. Every id
must have a `case` that returns a `Puzzle`. The function receives:

- `m` — the `PuzzleMeta` for this id.
- `difficulty` — `"easy" | "medium" | "hard"` (adaptive from the user's solve
  count).
- `max` — a difficulty-scaled cap (`10 / 16 / 24`) for random ranges.

A minimum-viable choice puzzle looks like:

```typescript
case "myNewPuzzle": {
  const a = rand(2, max);
  const b = rand(2, max);
  return makeChoice(
    {
      ...base(m, difficulty, "choice", `What is ${a} × ${b}?`, {
        kind: "icon",
        icon: m.emoji,
        title: `${a} × ${b}`,
        subtitle: "Multiplication",
      }),
      hint: "Multiply the two numbers.",
      hints: [`Use the times-table.`, `${a} groups of ${b}.`],
      explanation: `${a} × ${b} = ${a * b}.`,
    },
    String(a * b),
    numberChoices(a * b),
  );
}
```

That's it — the rest (XP, persistence, filters, AI, animations) is automatic.

---

## 2. The `Puzzle` data model

`makePuzzle` must return a `Puzzle`. You almost never construct one by hand —
use the helpers in section 3. But it is helpful to know the shape:

```typescript
interface Puzzle {
  id: string;            // unique per instance — set by base()
  type: PuzzleId;
  title: string;
  emoji: string;
  difficulty: Difficulty;
  mode: Mode;
  prompt: string;
  hint: string;
  hints?: string[];
  explanation: string;
  visual: Visual;        // see "Visuals" below
  // …mode-specific fields below
  choices?: string[];
  answer?: string;
  slider?: { min, max, step, initial, target };
  dragItems?: string[];
  dropLabel?: string;
  pairs?: { left, right }[];
  pathTiles?: string[];
  correctPath?: number[];
  targetRotation?: number;
  rotationStep?: number;
  tiles?: string[];
  correctOrder?: string[];
  numpadAnswer?: string;
  numpadAllowDecimal?: boolean;
  numpadAllowMinus?: boolean;
  sortItems?: { label, category }[];
  sortCategories?: string[];
  xpReward?: number;
}
```

### Visuals

Every puzzle needs a `Visual`. The renderer picks the layout based on
`visual.kind`. The most-used kinds are:

| `kind`        | Use for                                                          |
| ------------- | ---------------------------------------------------------------- |
| `icon`        | Generic: a big emoji + title + subtitle. Default for most cases. |
| `scale`       | Balance-scale style puzzles (weights, equations).                |
| `pizza`       | Fraction pizza renderer.                                         |
| `machine`     | Function-machine input/output display.                           |
| `coordinate`  | Coordinate plane / scatter.                                      |
| `equation`    | Reactant + product chips.                                        |
| `vectors`     | Arrow vectors.                                                   |
| `code`        | Code-trace puzzles (uses `visual.code.lines`).                   |
| `circuit`     | Circuit / breadboard.                                            |
| `truthTable`  | Logic-gate truth tables.                                         |
| `gears`       | Gear-ratio renderer.                                             |
| `grid`        | Tile grid for path puzzles.                                      |
| `fold`        | Rotate / fold renderer.                                          |
| `binary`      | Bit string display.                                              |
| `rockCycle`   | Rock-cycle stages.                                               |

Pass kind-specific fields (e.g. `code: { lines: [...], highlight: 2 }`) on the
`Visual` directly.

---

## 3. The 10 interaction modes and their helpers

Each `Mode` has a high-level builder. Use them — they wire `mode`, `prompt`,
`visual`, `hint`/`hints`/`explanation`, randomized variant selection
(`variedPrompt`), and the right answer slots automatically.

| Mode       | High-level helper          | When to use                                                                              |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------- |
| `"choice"` | `makeChoice` / `choiceEng` | Multiple choice with 4 options.                                                          |
| `"drag"`   | `dragEng`                  | Drag-and-drop one tile into a slot.                                                      |
| `"slider"` | `sliderEng`                | Set a numeric dial to a target value.                                                    |
| `"match"`  | `matchEng`                 | Pair left items with right items.                                                        |
| `"path"`   | `pathEng`                  | Tap tiles in order to trace a route.                                                     |
| `"rotate"` | `rotateEng`                | Rotate a shape until it hits the target angle.                                           |
| `"reorder"`| `reorderEng`               | Drag tiles into the correct sequence.                                                    |
| `"swipe"`  | (inline)                   | Swipe in a target direction. Used for `escapeRoom`.                                      |
| `"numpad"` | `numpadEng`                | Type the exact numeric answer.                                                           |
| `"sort"`   | `sortEng`                  | Tap a card, then a bucket. Multiple categories.                                          |

### Signatures (copy-paste reference)

```typescript
makeChoice(puzzle, answer, choices)
numpadEng(meta, difficulty, prompt, visual, answer, hint, hints, explanation, allowMinus?)
reorderEng(meta, difficulty, prompt, correctOrder, hint, hints, explanation)
sortEng(meta, difficulty, prompt, categories, items, hint, hints, explanation)
pathEng(meta, difficulty, prompt, stops, hint, hints, explanation)
sliderEng(meta, difficulty, prompt, range, subtitle, hint, hints, explanation)
dragEng(meta, difficulty, prompt, answer, distractors, dropLabel, hint, hints, explanation)
rotateEng(meta, difficulty, prompt, targetRotation, rotationStep, hint, hints, explanation)
matchEng(meta, difficulty, prompt, pairs, hint, hints, explanation)
choiceEng(meta, difficulty, prompt, visual, answer, distractors, hint, hints, explanation)
```

`makeChoice` is the rawest of the bunch — it expects a partially-built
`Puzzle` (use `base(...)` to seed it) and an `answer`/`choices` pair. The
others build the whole `Puzzle` for you.

`reorderEng`, `sortEng`, `pathEng`, and `matchEng` automatically sample a
focused subset of the full content via `challengeSubset` / `sample`, so the
same generator produces a different slice on each play.

---

## 4. Making each puzzle replay-unique — the **variant bank** pattern

Static content is the enemy of replay. The arcade has four `bank*` helpers
that pick a random variant from a typed array of inputs:

```typescript
bankReorder(meta, difficulty, [
  { prompt, order, hint, hints?, explanation },
  ...
])

bankMatch(meta, difficulty, [
  { prompt, pairs, hint, hints?, explanation },
  ...
])

bankSort(meta, difficulty, [
  { prompt, categories, items, hint, hints?, explanation },
  ...
])

bankChoice(meta, difficulty, [
  { prompt, visual, answer, distractors, hint, hints?, explanation },
  ...
])
```

Each call to the puzzle picks one variant uniformly at random and runs it
through the corresponding `*Eng` helper (so subset-sampling still kicks in).

### Worked example — converting a static case to a bank

```typescript
// Before (every play is identical):
case "engineEfficiency": {
  const pairs: [string, string][] = [
    ["Carnot", "Best-case bound"],
    ["Otto", "Spark-ignition"],
    ["Diesel", "Compression-ignition"],
    ["Brayton", "Gas turbine"],
  ];
  return matchPuzzle(m, difficulty,
    "Pair each thermodynamic cycle with its engine.", pairs);
}

// After (random variant per play):
case "engineEfficiency": {
  return bankMatch(m, difficulty, [
    {
      prompt: "Pair each thermodynamic cycle with its engine.",
      pairs: [["Carnot", "Best-case bound"], ["Otto", "Spark-ignition"],
              ["Diesel", "Compression-ignition"], ["Brayton", "Gas turbine"]],
      hint: "Match cycle name to engine family.",
      explanation: "Carnot bounds efficiency; Otto = gasoline; Diesel = compression-ignition; Brayton = gas turbine.",
    },
    {
      prompt: "Pair each cycle with its idealized characteristic.",
      pairs: [["Carnot", "All-isothermal heat transfer"], ["Otto", "Constant-volume heat addition"],
              ["Diesel", "Constant-pressure heat addition"], ["Brayton", "Constant-pressure combustion"]],
      hint: "How is heat added or rejected?",
      explanation: "Carnot is fully reversible; Otto is constant-V; Diesel and Brayton are constant-P.",
    },
    // ...add as many variants as you can support.
  ]);
}
```

**Guideline:** aim for **3–5 variants** per `bank*` case. The downstream
`*Eng` helpers will further sample subsets, so even a single variant produces
multiple distinct play instances.

### For modes without a `bank*` helper

For `choice`, `drag`, `slider`, `rotate`, and `numpad` you can either:

1. Drive **values** from `rand(...)` and `pick([...])` (the K-8/algebra
   approach — every play is numerically distinct).
2. Build a typed `variants` array of full setups and `const v = pick(variants);`
   at the top of the case (the science/social approach — every play is
   conceptually distinct).

Examples of both patterns are everywhere in `makePuzzle`. Look at
`weightScale` (style #1) and `domainRangePicker` (style #2).

---

## 5. The random toolkit

These utilities are defined right above `makePuzzle` and are used throughout.

| Helper                          | Purpose                                                                |
| ------------------------------- | ---------------------------------------------------------------------- |
| `rand(min, max)`                | Uniform integer in `[min, max]` inclusive.                             |
| `pick(items)`                   | Random element from an array.                                          |
| `sample(items, count)`          | Random `count` distinct elements (shuffled).                           |
| `shuffle(items)`                | Fisher–Yates shuffle, returns a new array.                             |
| `challengeSubset(items, min?, max?)` | Random contiguous slice of length `min..max` (defaults 4..6). Used by `reorderEng` and `pathEng`. |
| `variedPrompt(prompt, mode)`    | Appends one of three mode-appropriate framing sentences. Called by the `*Eng` helpers automatically. |
| `numberChoices(answer, spread?)`| Returns 4 string options around `answer` (used after `makeChoice`).    |
| `gcd(a, b)` / `frac(n, d)`      | Number theory helpers used in arithmetic puzzles.                      |

If your puzzle currently produces identical content on repeated plays, the
fastest fix is to wire it through `pick`, `sample`, or one of the `bank*`
helpers — see section 4.

---

## 6. Progression — XP gates, prerequisites, boss & mastery

Default unlock XP is grade-based (`GRADE_BASE_XP`):

| Grade  | Base XP |
| ------ | ------- |
| `K-8`  | 0       |
| `9`    | 0       |
| `10`   | 500     |
| `11`   | 1,200   |
| `12`   | 2,500   |

You can override or add to this on `METAS`:

- `xpRequired: 80` — **replaces** the default.
- `isBoss: true` — adds **+300 XP** to the default and marks the card as a
  boss. The arcade also requires `BOSS_CATEGORY_THRESHOLD` (= 5) completions
  in the same category before unlocking.
- `isMasteryTest: true` — adds **+500 XP** to the default and requires
  `MASTERY_CATEGORY_THRESHOLD` (= 8) completions in the same category.
- `prerequisites: ["otherPuzzleId"]` — must be completed first.

XP reward per win is computed by `xpRewardFor(difficulty)`:

| Difficulty | XP   |
| ---------- | ---- |
| easy       | 14   |
| medium     | 18   |
| hard       | 22   |

---

## 7. Optional — AI-generated mode

If `interactionHint` is one of `choice`, `match`, `sort`, `reorder`, or
`numpad`, the puzzle is automatically AI-compatible (see `aiCompatibleMode`).
When the user toggles "AI ON" the arcade tries `POST /api/stem-puzzle/generate`
first and falls back to the procedural `case` on failure. You do not need to
do anything extra to enable AI generation — the procedural case is the source
of truth and the safety net.

If you want to **opt out** of AI for a puzzle, use any of the non-AI
`interactionHint` modes (`drag`, `slider`, `path`, `rotate`, `swipe`).

---

## 8. Checklist for a new puzzle

1. [ ] Pick a stable camelCase id. Add it to `PuzzleId`.
2. [ ] Add a row in `METAS` via `m(...)` or `s(...)`. Confirm grade, subject,
       gradient, emoji, and `interactionHint`.
3. [ ] If using a new subject, extend the `Subject` union and the
       `SCIENCE_SUBJECTS` / `TECH_SUBJECTS` / `ENGINEERING_SUBJECTS` array as
       needed.
4. [ ] If you want a custom interaction-filter label, set `displayInteraction`.
5. [ ] Add a `case "yourId":` block in `makePuzzle`. Return a `Puzzle` via the
       correct helper for your mode.
6. [ ] Make it **replay-unique**: use one of `rand`, `pick`, `sample`, a
       `variants` array with `pick(variants)`, or the `bank*` helper that
       matches your mode.
7. [ ] Set `xpRequired` / `isBoss` / `isMasteryTest` / `prerequisites` if you
       want to tune the unlock placement.
8. [ ] Run `npx tsc --noEmit -p .` from `apps/web` to confirm the union and
       switch are still exhaustive.
9. [ ] Smoke test in the dev server: filter to your subject, open the card,
       solve it twice to confirm replay variety, and run with the AI toggle
       on to confirm the procedural fallback still works.

---

## 9. Quick patterns by mode

### Multiple choice with numeric answer

```typescript
case "myAddPuzzle": {
  const a = rand(2, max);
  const b = rand(2, max);
  const answer = a + b;
  return makeChoice(
    {
      ...base(m, difficulty, "choice", `What is ${a} + ${b}?`, {
        kind: "icon", icon: m.emoji, title: `${a} + ${b}`, subtitle: "Add them",
      }),
      hint: "Combine the two numbers.",
      hints: [`Count up from ${a}.`, `${a} + ${b}.`],
      explanation: `${a} + ${b} = ${answer}.`,
    },
    String(answer),
    numberChoices(answer),
  );
}
```

### Numpad

```typescript
case "myCircleArea": {
  const r = rand(2, 8);
  const area = +(Math.PI * r * r).toFixed(2);
  return numpadEng(m, difficulty,
    `Circle with radius ${r}. Area?`,
    { kind: "icon", icon: "⭕", title: `r = ${r}`, subtitle: "A = πr²" },
    area,
    "Use A = πr².",
    ["Square the radius.", `π × ${r}² ≈ ?`],
    `A = π × ${r}² ≈ ${area}.`,
  );
}
```

### Match (with bank)

```typescript
case "siUnits": {
  return bankMatch(m, difficulty, [
    {
      prompt: "Pair each quantity with its SI unit.",
      pairs: [["Length", "meter"], ["Mass", "kilogram"], ["Time", "second"], ["Current", "ampere"]],
      hint: "Base SI units.",
      explanation: "Each base quantity has one SI base unit.",
    },
    {
      prompt: "Pair each derived quantity with its SI unit.",
      pairs: [["Force", "newton"], ["Energy", "joule"], ["Power", "watt"], ["Pressure", "pascal"]],
      hint: "Derived from base units.",
      explanation: "Each derived quantity has a named SI unit.",
    },
  ]);
}
```

### Sort (with bank)

```typescript
case "matterSort": {
  return bankSort(m, difficulty, [
    {
      prompt: "Sort each example into a state of matter.",
      categories: ["Solid", "Liquid", "Gas"],
      items: [
        { label: "Ice cube", category: "Solid" },
        { label: "Wood log", category: "Solid" },
        { label: "Water", category: "Liquid" },
        { label: "Olive oil", category: "Liquid" },
        { label: "Steam", category: "Gas" },
        { label: "Oxygen", category: "Gas" },
      ],
      hint: "Shape and volume distinguish phases.",
      hints: ["Solids hold shape.", "Gases fill the container."],
      explanation: "Phase depends on intermolecular bonds.",
    },
  ]);
}
```

### Reorder (with bank)

```typescript
case "rocketLaunchSteps": {
  return bankReorder(m, difficulty, [
    {
      prompt: "Order the steps of a controlled rocket launch.",
      order: ["Pre-flight checks", "Engine ignition", "Liftoff", "Stage separation", "Orbital insertion"],
      hint: "Checks first, orbit last.",
      hints: ["Liftoff after ignition.", "Stages drop along the way."],
      explanation: "Standard launch sequence.",
    },
  ]);
}
```

### Slider

```typescript
case "tuneFrequency": {
  const target = rand(1, 8);
  return sliderEng(m, difficulty,
    `Tune the frequency to ${target} Hz.`,
    { min: 0, max: 10, step: 1, initial: 0, target },
    `Target ${target} Hz`,
    "Stop the slider on the labeled value.",
    ["Each step is 1 Hz.", "Stop exactly on the target."],
    `Frequency target was ${target} Hz.`,
  );
}
```

### Drag

```typescript
case "missingOperand": {
  const a = rand(2, 9);
  const b = rand(2, 9);
  return dragEng(m, difficulty,
    `Drop the number that makes ${a} + ? = ${a + b}.`,
    String(b),
    [String(b + 1), String(b - 1), String(a + b)],
    `${a} + ? = ${a + b}`,
    "Inverse operation: subtract.",
    [`Subtract ${a} from both sides.`, `${a + b} − ${a} = ?`],
    `${a + b} − ${a} = ${b}.`,
  );
}
```

### Rotate

```typescript
case "alignArrow": {
  const target = pick([90, 180, 270] as const);
  return rotateEng(m, difficulty,
    `Rotate the arrow to ${target}°.`,
    target, 90,
    `Each tap rotates 90°.`,
    [`Total rotation needed: ${target}°.`, `${target / 90} taps.`],
    `${target / 90} × 90° = ${target}°.`,
  );
}
```

### Path

```typescript
case "waterCircuit": {
  const stops = ["Reservoir", "Pump", "Pipe", "Valve", "Outlet"];
  return pathEng(m, difficulty,
    "Trace the flow from reservoir to outlet.",
    stops,
    "Follow the flow path.",
    ["Pumps add pressure.", "Valves control flow."],
    "Reservoir → pump → pipe → valve → outlet.",
  );
}
```

---

## 10. File map (where to look)

All inside
`apps/web/src/app/(marketing)/math-puzzles/page.tsx`:

| Region (approx. line) | What it does                                                          |
| --------------------- | --------------------------------------------------------------------- |
| `~6–95`               | Top-level type unions: `Difficulty`, `Mode`, `Grade`, `Subject`, `InteractionTypeKey`. |
| `~97–467`             | The `PuzzleId` union — add here.                                       |
| `~469–574`            | `PuzzleMeta`, `Visual`, `Puzzle`, `PlayState` interfaces.              |
| `~582–945`            | `m(...)` builder and the `METAS` array — add here.                     |
| `~945–1017`           | `s(...)` builder (METAS continued with options).                       |
| `~1019–1043`          | `domainFor` and XP-gate logic.                                         |
| `~1140–1230`          | Random toolkit (`rand`, `pick`, `sample`, `shuffle`, `challengeSubset`, `variedPrompt`, `numberChoices`). |
| `~1231–1477`          | `base`, `makeChoice`, `numpadEng`, `reorderEng`, `sortEng`, `pathEng`, `sliderEng`, `dragEng`, `rotateEng`, `matchEng`, `choiceEng`. |
| `~1479–1528`          | `bank*` variant helpers and their `Variant` interfaces.                |
| `~1530–end`           | The `makePuzzle` switch — add your `case` here.                        |

---

## 11. Common pitfalls

- **Forgot the `PuzzleId` entry.** TypeScript will flag this in `METAS` and
  in the `switch` exhaustiveness check.
- **Identical replays.** Use a `bank*` helper or a `pick(variants)` block.
- **AI mode silently disabled.** If you used `slider`/`drag`/`path`/`rotate`/
  `swipe`, AI generation is not available for this puzzle by design — only
  the procedural case runs.
- **Boss/mastery never unlocks.** Both also require **category completion
  thresholds** (5 and 8 respectively) — XP alone is not enough.
- **New subject doesn't appear under a domain.** Add it to one of
  `SCIENCE_SUBJECTS` / `TECH_SUBJECTS` / `ENGINEERING_SUBJECTS`, otherwise
  `domainFor` returns `"Math"`.
- **TypeScript "Object is possibly undefined"** when reading variants
  selected with `pick(...)`. Use optional chaining (`v[0]?.[1]`) or assert
  with a `pick(...) ?? fallback`.
