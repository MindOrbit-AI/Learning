import {
  addIntegersLesson,
  lesson,
  levelReviewLesson,
  mcScene,
  nlScene,
  subIntegersLesson,
} from "./_helpers";

/** Level 5 — The Number Line */
export const MATH_INTEGERS_LEVEL_5_SEEDS = [
  lesson(
    5,
    "the-number-line",
    "The Number Line",
    "beginner",
    [
      mcScene(
        "l5-nl-1",
        "Direction",
        "On a horizontal number line, numbers increase to the…",
        ["Right", "Left", "Top", "Bottom"],
        "Right",
        "l5_nl_direction",
        { correct: "Right is greater.", incorrect: "Positive direction → right.", hint: "→ larger." },
      ),
      nlScene("l5-nl-2", "Plot −6", "Place −6 on the number line.", -6, "l5_nl_plot", {
        correct: "Six left of 0.",
        incorrect: "−6 is left.",
        hint: "−6.",
      }),
      mcScene(
        "l5-nl-3",
        "Between",
        "Which integer is between −2 and 1?",
        ["−1", "−3", "2", "−2"],
        "−1",
        "l5_nl_between",
        { correct: "−1 is between −2 and 1.", incorrect: "Check order on the line.", hint: "−2 < −1 < 1." },
      ),
    ],
    nlScene("l5-nl-final", "Mastery check", "Place 7 on the number line.", 7, "l5_nl_mastery", {
      correct: "7 right of 0.",
      incorrect: "Seven ticks right.",
      hint: "7.",
    }),
  ),
  addIntegersLesson(5, "addition-on-the-number-line", "Addition on the Number Line", 1, 4),
  addIntegersLesson(5, "adding-large-integers", "Adding Large Integers", 9, -4),
  addIntegersLesson(5, "adding-several-integers", "Adding Several Integers", -2, 5),
  subIntegersLesson(5, "subtraction-from-0", "Subtraction from 0", 0, 9),
  subIntegersLesson(5, "subtraction-on-the-number-line", "Subtraction on the Number Line", 3, 7),
  levelReviewLesson(5, "level-review", "Level Review", [
    { prompt: "−4 + 6 on the line lands at?", choices: ["2", "−2", "10", "−10"], answer: "2" },
    { prompt: "0 − 5 = ?", choices: ["−5", "5", "0", "−1"], answer: "−5" },
    { prompt: "Which is right of −1?", choices: ["0", "−2", "−3", "−4"], answer: "0" },
    { prompt: "9 + (−4) = ?", choices: ["5", "−5", "13", "−13"], answer: "5" },
  ]),
];
