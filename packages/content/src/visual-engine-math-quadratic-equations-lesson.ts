/** Visual Problem Engine — quadratic equations via drag-and-drop (math). */
export const MATH_QUADRATIC_EQUATIONS_LESSON_SEED = {
  id: "lesson-quadratic-equations-drag",
  title: "Quadratic equations by drag & drop",
  subject: "Math",
  topic: "Quadratic equations",
  level: "beginner" as const,
  scenes: [
    {
      id: "quad-1-factor-steps",
      title: "Factor in order",
      type: "drag_drop_sort" as const,
      prompt: "Reorder the steps to solve x² − 5x + 6 = 0 by factoring.",
      visualPrompt: "Find numbers → write factors → zero-product → solutions.",
      data: {
        items: [
          "Solutions: x = 2 or x = 3",
          "Set each factor to zero: (x − 2)(x − 3) = 0",
          "Find two numbers that multiply to +6 and add to −5: −2 and −3",
          "Write (x − 2)(x − 3) = 0",
        ],
      },
      interaction: "reorder" as const,
      validation: {
        type: "ordered_sequence" as const,
        expectedOrder: [
          "Find two numbers that multiply to +6 and add to −5: −2 and −3",
          "Write (x − 2)(x − 3) = 0",
          "Set each factor to zero: (x − 2)(x − 3) = 0",
          "Solutions: x = 2 or x = 3",
        ],
      },
      feedback: {
        correct: "−2 × −3 = 6 and −2 + −3 = −5 — then zero-product gives x = 2 and x = 3.",
        incorrect: "Start by finding the pair of numbers, then build the factors.",
        hint: "Which step finds −2 and −3 before writing parentheses?",
      },
      masteryTarget: { conceptNodeId: "quadratic-equations", skill: "factor_steps_order" },
    },
    {
      id: "quad-2-match-roots",
      title: "Match the roots",
      type: "drag_drop_match" as const,
      prompt: "Place the correct roots of x² − 5x + 6 = 0 into the slots (smaller first).",
      visualPrompt: "(x − 2)(x − 3) = 0 → x = 2 and x = 3.",
      data: {
        items: [
          { id: "r2", label: "x = 2" },
          { id: "r3", label: "x = 3" },
          { id: "rn2", label: "x = −2" },
        ],
        slots: [
          { id: "root_a", label: "Smaller root" },
          { id: "root_b", label: "Larger root" },
        ],
      },
      interaction: "drag_to_place" as const,
      validation: {
        type: "slot_match" as const,
        expected: { root_a: "r2", root_b: "r3" },
      },
      feedback: {
        correct: "x = 2 and x = 3 — the roots from (x − 2)(x − 3) = 0.",
        incorrect: "Both roots are positive: 2 and 3, not −2.",
        hint: "Which two values make each factor zero?",
      },
      masteryTarget: { conceptNodeId: "quadratic-equations", skill: "match_quadratic_roots" },
    },
    {
      id: "quad-3-build-factors",
      title: "Build the factors",
      type: "drag_drop_match" as const,
      prompt: "Drag the correct binomial factors for x² + 7x + 12 into the slots.",
      visualPrompt: "Need two numbers that multiply to 12 and add to 7: 3 and 4.",
      data: {
        items: [
          { id: "p3", label: "(x + 3)" },
          { id: "p4", label: "(x + 4)" },
          { id: "p2", label: "(x + 2)" },
          { id: "p6", label: "(x + 6)" },
        ],
        slots: [
          { id: "slot_plus3", label: "Factor with +3" },
          { id: "slot_plus4", label: "Factor with +4" },
        ],
      },
      interaction: "drag_to_place" as const,
      validation: {
        type: "slot_match" as const,
        expected: { slot_plus3: "p3", slot_plus4: "p4" },
      },
      feedback: {
        correct: "(x + 3)(x + 4) expands to x² + 7x + 12.",
        incorrect: "3 × 4 = 12 and 3 + 4 = 7 — use (x + 3) and (x + 4).",
        hint: "Match the constant +12 and the middle term +7x.",
      },
      masteryTarget: { conceptNodeId: "quadratic-equations", skill: "build_quadratic_factors" },
    },
    {
      id: "quad-4-vertex",
      title: "Parabola vertex",
      type: "graph_plot" as const,
      prompt: "The graph of y = (x − 2)² − 1 is a parabola. Place its vertex on the grid.",
      visualPrompt: "Vertex form (x − h)² + k → vertex (h, k) = (2, −1).",
      data: {
        xMin: -1,
        xMax: 5,
        yMin: -4,
        yMax: 4,
        lines: [],
      },
      interaction: "place_point" as const,
      validation: {
        type: "point_match" as const,
        expectedPoint: { x: 2, y: -1 },
        tolerance: 0.45,
      },
      feedback: {
        correct: "Vertex (2, −1) — the lowest point of y = (x − 2)² − 1.",
        incorrect: "In (x − 2)² − 1, h = 2 and k = −1.",
        hint: "Read h and k from vertex form: (x − h)² + k.",
      },
      masteryTarget: { conceptNodeId: "quadratic-equations", skill: "quadratic_vertex_plot" },
    },
    {
      id: "quad-5-standard-form",
      title: "Standard form ax² + bx + c",
      type: "drag_drop_match" as const,
      prompt: "Match each term of x² + 5x + 6 to the correct slot in ax² + bx + c.",
      visualPrompt: "a = 1 on x², b = 5 on x, c = 6 constant.",
      data: {
        items: [
          { id: "t_x2", label: "x²" },
          { id: "t_5x", label: "5x" },
          { id: "t_6", label: "6" },
          { id: "t_x", label: "x" },
          { id: "t_5", label: "5" },
        ],
        slots: [
          { id: "term_a", label: "ax² term" },
          { id: "term_b", label: "bx term" },
          { id: "term_c", label: "Constant c" },
        ],
      },
      interaction: "drag_to_place" as const,
      validation: {
        type: "slot_match" as const,
        expected: { term_a: "t_x2", term_b: "t_5x", term_c: "t_6" },
      },
      feedback: {
        correct: "x² + 5x + 6 — a = 1, b = 5, c = 6 in standard form.",
        incorrect: "The x² term is a, the x term is b, and the lone number is c.",
        hint: "Place 5x in the bx slot, not just x or 5.",
      },
      masteryTarget: { conceptNodeId: "quadratic-equations", skill: "quadratic_standard_form" },
    },
    {
      id: "quad-6-formula-steps",
      title: "Quadratic formula steps",
      type: "drag_drop_sort" as const,
      prompt: "Order the steps to solve x² + 6x + 5 = 0 with the quadratic formula.",
      visualPrompt: "Identify a, b, c → substitute → simplify → solve.",
      data: {
        items: [
          "Solutions: x = −1 or x = −5",
          "Identify a = 1, b = 6, c = 5",
          "Substitute into x = (−b ± √(b² − 4ac)) / 2a",
          "Simplify: x = (−6 ± 4) / 2",
        ],
      },
      interaction: "reorder" as const,
      validation: {
        type: "ordered_sequence" as const,
        expectedOrder: [
          "Identify a = 1, b = 6, c = 5",
          "Substitute into x = (−b ± √(b² − 4ac)) / 2a",
          "Simplify: x = (−6 ± 4) / 2",
          "Solutions: x = −1 or x = −5",
        ],
      },
      feedback: {
        correct: "a, b, c first — then formula, simplify, and read off x = −1 and x = −5.",
        incorrect: "You need coefficients before substituting into the formula.",
        hint: "What are a, b, and c for x² + 6x + 5?",
      },
      masteryTarget: { conceptNodeId: "quadratic-equations", skill: "quadratic_formula_order" },
    },
  ],
  finalMasteryCheck: {
    id: "quad-final-factor",
    title: "Mastery check",
    type: "drag_drop_match" as const,
    prompt: "Factor x² − 9 = 0 by placing the correct binomial factors in the slots.",
    visualPrompt: "Difference of squares: a² − b² = (a + b)(a − b).",
    data: {
      items: [
        { id: "fp3", label: "(x + 3)" },
        { id: "fm3", label: "(x − 3)" },
        { id: "fp9", label: "(x + 9)" },
        { id: "fm1", label: "(x − 1)" },
      ],
      slots: [
        { id: "f_pos", label: "Factor with +3" },
        { id: "f_neg", label: "Factor with −3" },
      ],
    },
    interaction: "drag_to_place" as const,
    validation: {
      type: "slot_match" as const,
      expected: { f_pos: "fp3", f_neg: "fm3" },
    },
    feedback: {
      correct: "x² − 9 = (x + 3)(x − 3) — roots x = 3 and x = −3.",
      incorrect: "9 = 3² — use (x + 3) and (x − 3).",
      hint: "Which pair multiplies to give x² − 9?",
    },
    masteryTarget: { conceptNodeId: "quadratic-equations", skill: "quadratic_factor_mastery" },
  },
} as const;
