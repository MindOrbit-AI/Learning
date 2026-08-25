import type { BlogPost } from "./types";

export const BLOG_POSTS: readonly BlogPost[] = [
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
