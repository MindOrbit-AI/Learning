import type { BlogPost } from "./types";

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: "one-next-step-beats-content-library",
    title: "Why one next step beats a content library",
    excerpt:
      "More resources rarely fix the wrong problem. The highest-leverage move is almost always singular—and it comes from knowing where you are on the map.",
    publishedAt: "2026-08-26",
    author: { name: "MindOrbit Team", role: "Product & pedagogy" },
    tags: ["Study systems", "Mastery maps", "Habit"],
    readingTimeMinutes: 5,
    sections: [
      {
        type: "paragraph",
        text: "Open any learning app and you face a paradox of choice: hundreds of lessons, infinite practice sets, and a dashboard that treats every topic as equally urgent. Students respond the way humans always do—they pick what feels manageable, what a friend mentioned, or what aligns with tomorrow's homework. None of that requires knowing what actually needs fixing.",
      },
      {
        type: "heading",
        text: "Libraries optimize for coverage; learners need sequence",
        level: 2,
      },
      {
        type: "paragraph",
        text: "Content libraries are built for completeness. A curriculum team maps standards to units; an engineering team maps units to screens. The result is breadth—every node exists somewhere—but not ordering. Ordering is the hard part, because it depends on what you already hold and what upstream idea never landed.",
      },
      {
        type: "list",
        items: [
          "A weak fraction foundation makes every ratio problem feel like bad luck",
          "Reviewing chapter twelve while chapter four is fragile wastes retrieval reps",
          "Studying \"more\" without a target node produces busy work, not compounding progress",
        ],
      },
      {
        type: "heading",
        text: "The loop: diagnose, map, one mission, retain",
        level: 2,
      },
      {
        type: "paragraph",
        text: "Durable learning systems close a loop instead of opening a catalog. You start with a short diagnostic—not to produce a score, but to locate weak nodes on a dependency graph. The map makes prerequisites visible. The next step is deliberately singular: one mission on the highest-leverage cluster, then spaced review to prove the gain survived a day.",
      },
      {
        type: "paragraph",
        text: "That constraint is a feature. When the app recommends exactly one move, decision fatigue drops and completion rates rise. Parents see clarity too: not \"they practiced algebra for forty minutes,\" but \"they repaired the slope prerequisite that was blocking linear systems.\"",
      },
      {
        type: "heading",
        text: "What to do when everything feels urgent",
        level: 2,
      },
      {
        type: "paragraph",
        text: "Exam season amplifies the urge to touch every topic. Resist the scatter. Use the map to find the node whose repair unlocks the most downstream work—often an idea three chapters back, not on tonight's worksheet. Fix that one thing, schedule a review, then let the map update before you choose again.",
      },
      {
        type: "paragraph",
        text: "MindOrbit is built around this loop: see what's missing, understand why it's missing, take one constrained action, and watch the graph change. The goal is not to consume more content—it is to move the right node from fragile to durable, one step at a time.",
      },
    ],
  },
  {
    slug: "diagnostics-before-exam-season",
    title: "Why diagnostics beat guesswork before exam season",
    excerpt:
      "Most students study what feels uncertain—not what is actually missing. A short diagnostic can reorder your entire prep plan.",
    publishedAt: "2026-08-18",
    author: { name: "MindOrbit Team", role: "Learning science" },
    tags: ["Diagnostics", "Study strategy", "Grades 6–12"],
    readingTimeMinutes: 5,
    sections: [
      {
        type: "paragraph",
        text: "Exam season compresses time. When every hour counts, the costliest mistake is not studying the wrong topic—it is studying the right topic while a prerequisite gap quietly undermines every problem you attempt.",
      },
      {
        type: "paragraph",
        text: "Traditional prep starts with a feeling: “I’m shaky on chapter seven.” Diagnostics start with evidence: which concepts are mastered, which are fragile, and which upstream ideas never fully landed.",
      },
      {
        type: "heading",
        text: "Feelings are noisy; mastery signals are not",
        level: 2,
      },
      {
        type: "paragraph",
        text: "Confidence and competence diverge more often than students expect. You can recognize a formula in notes and still fail to apply it under time pressure. A well-designed diagnostic probes transfer—not recall—so your study list reflects capability, not familiarity.",
      },
      {
        type: "list",
        items: [
          "Surface hidden prerequisite gaps before they show up as “careless errors”",
          "Separate topics that need review from topics that need re-teaching",
          "Prioritize the smallest set of moves that unlock the most downstream progress",
        ],
      },
      {
        type: "heading",
        text: "Five minutes can reorder a week of study",
        level: 2,
      },
      {
        type: "paragraph",
        text: "MindOrbit’s try flow is built around this idea: a short, structured assessment that maps understanding and suggests what to fix first. The output is not a score to brag about—it is a sequence. Fix A before grinding B. Reinforce C before mock exams pile on.",
      },
      {
        type: "paragraph",
        text: "That reordering is the difference between busy work and compounding progress. Diagnostics do not replace practice—they aim it.",
      },
    ],
  },
  {
    slug: "spaced-repetition-vs-cramming",
    title: "The science of spaced repetition (and why cramming fails)",
    excerpt:
      "Cramming can pass tomorrow’s quiz and still lose next month’s exam. Spacing works because memory has a schedule—not a switch.",
    publishedAt: "2026-08-10",
    author: { name: "MindOrbit Team", role: "Learning science" },
    tags: ["Retention", "Spaced repetition", "Memory"],
    readingTimeMinutes: 6,
    sections: [
      {
        type: "paragraph",
        text: "Cramming feels efficient. Intense repetition in one sitting produces a burst of performance—and a false sense of security. The problem is not effort; it is timing. Memory consolidation needs sleep, spacing, and retrieval practice distributed over days.",
      },
      {
        type: "heading",
        text: "The forgetting curve is not your enemy",
        level: 2,
      },
      {
        type: "paragraph",
        text: "Ebbinghaus showed that we forget predictably. Spaced repetition exploits that curve by re-exposing you to material just as it becomes hard to recall. That difficulty is the signal: your brain is strengthening the pathway, not failing the test.",
      },
      {
        type: "list",
        items: [
          "First exposure: encode the idea with clarity, not speed",
          "Short-interval review: catch decay before it compounds",
          "Longer intervals: prove durability under realistic delay",
          "Interleaving: mix related problem types so transfer improves",
        ],
      },
      {
        type: "heading",
        text: "What good systems automate",
        level: 2,
      },
      {
        type: "paragraph",
        text: "Manual flashcard decks work when you maintain them religiously. Most students do not—and should not have to. A mastery-aware review queue tracks what you know, what is at risk, and when each node deserves another pass.",
      },
      {
        type: "paragraph",
        text: "MindOrbit ties spacing to your map: weak nodes get tighter intervals; stable nodes fade into maintenance. The goal is not infinite drills—it is durable understanding that survives the calendar.",
      },
    ],
  },
  {
    slug: "mastery-maps-reveal-hidden-gaps",
    title: "How mastery maps reveal what textbooks hide",
    excerpt:
      "Chapters imply linear progress. Real learning is a graph—and the missing link is often three topics back, not on tonight’s page.",
    publishedAt: "2026-08-01",
    author: { name: "MindOrbit Team", role: "Product & pedagogy" },
    tags: ["Mastery maps", "Concept graphs", "Prerequisites"],
    readingTimeMinutes: 5,
    sections: [
      {
        type: "paragraph",
        text: "Textbooks are organized for printing: unit one, unit two, appendix. Understanding is organized as dependencies: fractions before ratios, slope before linear systems, cell structure before mitosis. When progress looks linear but cognition is networked, gaps hide in plain sight.",
      },
      {
        type: "heading",
        text: "A map turns confusion into a location",
        level: 2,
      },
      {
        type: "paragraph",
        text: "A mastery map makes dependencies visible. Each node represents a concept; edges represent what must hold for the next idea to stick. States—mastered, in progress, at risk—turn vague anxiety into actionable coordinates.",
      },
      {
        type: "list",
        items: [
          "See which weak nodes block entire branches of the curriculum",
          "Trace errors upstream instead of repeating the same correction",
          "Watch progress compound as foundational nodes stabilize",
        ],
      },
      {
        type: "heading",
        text: "From map to next step",
        level: 2,
      },
      {
        type: "paragraph",
        text: "Insight without a next step becomes overwhelm. The map is useful only when it recommends a single best move: the mission that closes the highest-leverage gap. That is the loop MindOrbit is built around—diagnose, map, mission, reinforce.",
      },
      {
        type: "paragraph",
        text: "If your study plan is a checklist of chapters, you are navigating with a table of contents. If it is a map, you are navigating with topology. The second one finds gaps the first one cannot see.",
      },
    ],
  },
];
