# MindOrbit Product Loop

**One-line:** A continuously updating map of what a child knows, what they're missing, why they're struggling, and exactly what they should do next.

**Category:** Structured mastery intelligence — AI inside the graph, not a blank chat tutor.

---

## The loop

```
Diagnose → Map → Learn → Practice → Master → Retain → Expand → (back to Diagnose)
```

| Stage | Job to be done | Success signal |
|-------|----------------|----------------|
| **Diagnose** | Fast, honest signal on known vs. missing | Diagnostic completed; weak nodes identified |
| **Map** | Make gaps visible with dependency context | Mastery map opened; parent understands "why here" |
| **Learn** | Targeted instruction on the right node | Mission/lesson started on weakest cluster |
| **Practice** | Deliberate reps until competence shows | Correct application across varied items |
| **Master** | Measurable state change on the graph | Node moves weak → learning → mastered |
| **Retain** | Knowledge survives time and context shift | Spaced retrieval succeeds; decay prevented |
| **Expand** | Next best action across the graph | Learner takes recommended next node/subject |

**North-star habit (early):** % of new users who complete ≥1 mission in first 7 days after diagnostic.

**Parent one-liner:** *Five minutes to see what's missing, why it's missing, and exactly what to practice next — with a map that updates every time they learn.*

---

## Four promises (differentiation)

None of the incumbents delivers all four together:

1. **Know** — A live model of mastery per concept (not "completed lesson 7")
2. **Gap** — What's missing, with prerequisite context ("weak here because X never solidified")
3. **Why** — Misconception telemetry, not just wrong/right
4. **Next** — One constrained action, not a content library

| Competitor | Strength | Gap MindOrbit fills |
|------------|----------|---------------------|
| IXL | Practice volume | No reasoning map; weak "why" |
| Khan Academy | Content breadth | Linear paths; no live per-child gap model |
| Brilliant | Visual learn-by-doing | No longitudinal mastery graph |
| Duolingo | Habit + SRS | No subject depth or diagnostic depth |
| AI tutor (ChatGPT, etc.) | Answers anything | No guaranteed progression or standards alignment |

**Moat (honest):** Today = clarity of next step + wedge content. Tomorrow = **calibrated items + outcome data per node** (which interventions move weak → mastered for which gap profiles).

---

## What exists today (by stage)

| Stage | Status | Key surfaces |
|-------|--------|--------------|
| Diagnose | **Built** | `/try-diagnostic`, `/diagnostics/[slug]`, guest claim flow |
| Map | **Built** | `/mastery-map`, prerequisite graph, node sidebar |
| Learn | **Built (fragmented)** | Missions, visual engine (`/learn`), micro-lessons, community UGC |
| Practice | **Built (fragmented)** | Missions, concept arena, games, puzzles |
| Master | **Built** | `learning-state-engine`, dashboard, insights (PRO), shareable mastery |
| Retain | **Partial** | `/review` queue, spaced intervals — self-report, no embedded retrieval |
| Expand | **Partial** | Map neighbor suggestions, ingestion — no cross-subject recommender |

**Sacred loop (ship first):**

```
Diagnostic → map with weak nodes → one mission on weakest cluster → visible node state change → review scheduled
```

Defer or thin until numbers prove habit: full-graph exploration, community density, multi-subject parity, advanced insights.

---

## Retain + Expand roadmap

Prioritized by impact on loop closure and parent trust.

### P0 — Close the loop in UX (4–6 weeks)

| Item | Why | Acceptance criteria |
|------|-----|-------------------|
| **Unified "Today's path"** | Practice/Learn fragmented across missions, games, arena | Single dashboard card: diagnose result → current mission → due review → next expand |
| **Parent "Why" panel** | Parents buy clarity, not graphs | Post-diagnostic + node sidebar show misconception + prerequisite chain in plain language |
| **Retrieval-based review** | Self-report "Got it" ≠ retention | Review session runs 3–5 varied items per due node before clearing |
| **Visible mastery proof** | Trust requires "you moved" | Node state change animation + weekly parent email with before/after |

### P1 — Make Retain real (6–10 weeks)

| Item | Why | Acceptance criteria |
|------|-----|-------------------|
| **Adaptive SRS intervals** | Fixed 1/3/7/14d is coarse | Interval adjusts by mastery, error pattern, time-to-recall |
| **Cross-context checks** | Mastery ≠ one familiar question | Review items require application in new scene types |
| **Decay alerts** | "Knowledge at risk" is a diagnostic question we already ask | Dashboard + parent view flags nodes slipping from mastered → weak |
| **Review streak / habit hook** | Duolingo stickiness lives here | Due reviews surface in nav badge; streak counts cleared reviews |

### P2 — Make Expand intelligent (8–12 weeks)

| Item | Why | Acceptance criteria |
|------|-----|-------------------|
| **Next-best-action engine** | Neighbor suggestions aren't enough | Ranked queue: repair weak → unlock prerequisite → stretch challenge → cross-subject bridge |
| **Goal-aware paths** | SAT vs. grade-level vs. enrichment differ | User goal from onboarding weights expand recommendations |
| **Post-mission expand CTA** | Loop must close back to Map/Learn | Mission complete screen shows "what unlocked" + one-tap next mission |
| **Re-diagnose triggers** | Map stays live | Suggest re-diagnostic after N missions or mastery plateau |

### P3 — Moat data (ongoing)

| Item | Why | Acceptance criteria |
|------|-----|-------------------|
| **Intervention efficacy per node** | Outcome data = defensibility | Track weak → mastered time by mission type, misconception category |
| **Calibrated item bank** | Generation alone isn't enough | Human-reviewed anchor items per node for pre/post measurement |
| **Fixed efficacy item set** | Investor/parent proof | Pre/post on stable 20-item panel per subject wedge |

---

## Metrics by stage

| Stage | Primary metric | Secondary |
|-------|----------------|-----------|
| Diagnose | Diagnostic completion rate | Time to complete |
| Map | Map opened within 24h of diagnostic | Nodes explored |
| Learn | First mission started within 24h | Mission completion rate |
| Practice | Missions/week per active user | Error pattern resolution |
| Master | % nodes weak → mastered (30d) | Time weak → mastered |
| Retain | Review completion rate | Retrieval success rate |
| Expand | Next-mission take rate post-complete | Cross-subject adds |

---

## Positioning guardrails

**MindOrbit is not:** an AI tutoring product, homework assistant, flashcard drill platform, generic study tool, or course marketplace.

**MindOrbit is:** The system that maps, diagnoses, and strengthens understanding — with AI constrained by pedagogy and node telemetry.

**Investor line:** Diagnostic-first graph; generative practice constrained by pedagogy and node telemetry.

**Acquisition line (parent):** See what's missing. Fix that — not everything.
