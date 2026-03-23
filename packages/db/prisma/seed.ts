/**
 * MindOrbit Learn - Database Seed
 */

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import {
  algebraClusters,
  algebraEdges,
  algebraNodes,
  biologyClusters,
  biologyEdges,
  biologyNodes,
  chemistryClusters,
  chemistryEdges,
  chemistryNodes,
  computerScienceClusters,
  computerScienceEdges,
  computerScienceNodes,
  physicsClusters,
  physicsEdges,
  physicsNodes,
  satMathClusters,
  satMathEdges,
  satMathNodes,
} from "@mindorbit/content";

const prisma = new PrismaClient();

const SUBJECTS = [
  {
    slug: "community",
    title: "Community",
    description: "User-uploaded notes and summaries.",
    icon: "🌐",
    color: "#6B7280",
    createdById: null,
  },
  {
    slug: "algebra",
    title: "Algebra",
    description: "Master variables, equations, functions, and polynomials.",
    icon: "📐",
    color: "#3B82F6",
  },
  {
    slug: "biology",
    title: "Biology",
    description: "Cells, genetics, evolution, and human physiology.",
    icon: "🧬",
    color: "#22C55E",
  },
  {
    slug: "chemistry",
    title: "Chemistry",
    description: "Atomic structure, reactions, stoichiometry, and energy.",
    icon: "⚗️",
    color: "#10B981",
  },
  {
    slug: "computer-science",
    title: "Computer Science",
    description: "Programming, data structures, algorithms, and software design.",
    icon: "💻",
    color: "#8B5CF6",
  },
  {
    slug: "physics",
    title: "Physics",
    description: "Mechanics, waves, electricity, and modern physics.",
    icon: "🌌",
    color: "#F59E0B",
  },
  {
    slug: "sat-math",
    title: "SAT Math",
    description: "Algebra, problem solving, advanced math, and geometry for the SAT.",
    icon: "📊",
    color: "#EC4899",
  },
];

const DIAGNOSTIC_QUESTIONS: Record<
  string,
  Array<{
    nodeSlug: string;
    prompt: string;
    type: "multiple_choice" | "short_answer" | "true_false";
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
  }>
> = {
  chemistry: [
    {
      nodeSlug: "atomic-structure",
      prompt: "What determines the identity of an element?",
      type: "multiple_choice",
      options: ["Number of neutrons", "Number of protons", "Number of electrons", "Atomic mass"],
      correctAnswer: "Number of protons",
      explanation: "The atomic number (number of protons) uniquely identifies each element.",
    },
    {
      nodeSlug: "atomic-structure",
      prompt: "Isotopes of an element have the same number of protons but different numbers of neutrons.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Isotopes differ only in neutron count.",
    },
    {
      nodeSlug: "periodic-trends",
      prompt: "Which property generally decreases from left to right across a period?",
      type: "multiple_choice",
      options: ["Atomic radius", "Electronegativity", "Ionization energy", "Non-metallic character"],
      correctAnswer: "Atomic radius",
      explanation: "Atomic radius decreases across a period due to increasing nuclear charge.",
    },
    {
      nodeSlug: "chemical-bonding",
      prompt: "A covalent bond involves:",
      type: "multiple_choice",
      options: [
        "Transfer of electrons",
        "Sharing of electrons",
        "Sea of electrons",
        " electrostatic attraction only",
      ],
      correctAnswer: "Sharing of electrons",
      explanation: "Covalent bonds form when atoms share electron pairs.",
    },
    {
      nodeSlug: "balancing-equations",
      prompt: "Balance: __ H₂ + __ O₂ → __ H₂O",
      type: "multiple_choice",
      options: ["1,1,1", "2,1,2", "2,2,2", "1,2,1"],
      correctAnswer: "2,1,2",
      explanation: "2H₂ + O₂ → 2H₂O gives 4H and 2O on both sides.",
    },
    {
      nodeSlug: "mole-concept",
      prompt: "One mole of any substance contains approximately how many particles?",
      type: "multiple_choice",
      options: ["10²³", "6.022 × 10²³", "6.022 × 10²²", "10²²"],
      correctAnswer: "6.022 × 10²³",
      explanation: "Avogadro's number is 6.022 × 10²³ particles per mole.",
    },
    {
      nodeSlug: "mole-concept",
      prompt: "The molar mass of a compound in g/mol equals its molecular mass in amu.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "One amu = 1 g/mol at the macroscopic scale.",
    },
    {
      nodeSlug: "stoichiometry-calc",
      prompt: "In 2H₂ + O₂ → 2H₂O, how many moles of H₂O form from 4 moles of H₂?",
      type: "multiple_choice",
      options: ["2", "4", "6", "8"],
      correctAnswer: "4",
      explanation: "2:2 ratio means 4 mol H₂ produces 4 mol H₂O.",
    },
    {
      nodeSlug: "limiting-reagents",
      prompt: "The limiting reagent determines the maximum amount of product that can form.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "The limiting reactant is consumed first and limits the reaction.",
    },
    {
      nodeSlug: "thermochemistry",
      prompt: "An exothermic reaction releases heat to the surroundings.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Exothermic: ΔH < 0, heat is released.",
    },
  ],
  algebra: [
    {
      nodeSlug: "variables",
      prompt: "In the expression 3x + 5, what is the coefficient of x?",
      type: "multiple_choice",
      options: ["3", "5", "x", "3x"],
      correctAnswer: "3",
      explanation: "The coefficient is the number multiplying the variable.",
    },
    {
      nodeSlug: "order-of-operations",
      prompt: "Simplify: 2 + 3 × 4",
      type: "multiple_choice",
      options: ["20", "14", "24", "12"],
      correctAnswer: "14",
      explanation: "Multiplication before addition: 3×4=12, then 2+12=14.",
    },
    {
      nodeSlug: "linear-equations",
      prompt: "Solve for x: 2x + 4 = 10",
      type: "multiple_choice",
      options: ["x=2", "x=3", "x=4", "x=6"],
      correctAnswer: "x=3",
      explanation: "2x=6, so x=3.",
    },
    {
      nodeSlug: "quadratic-equations",
      prompt: "The solutions to x² = 4 are x = 2 and x = -2.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Both 2² and (-2)² equal 4.",
    },
    {
      nodeSlug: "function-basics",
      prompt: "A function assigns exactly one output to each input.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "By definition, each input maps to exactly one output.",
    },
  ],
  "sat-math": [
    {
      nodeSlug: "linear-equations-sat",
      prompt: "If 2x + 5 = 15, what is x?",
      type: "multiple_choice",
      options: ["5", "10", "7.5", "4"],
      correctAnswer: "5",
      explanation: "2x=10, so x=5.",
    },
    {
      nodeSlug: "systems-of-equations",
      prompt: "The system y=x+1 and y=2x-1 has how many solutions?",
      type: "multiple_choice",
      options: ["0", "1", "2", "Infinitely many"],
      correctAnswer: "1",
      explanation: "Two distinct lines intersect at exactly one point.",
    },
    {
      nodeSlug: "percentages",
      prompt: "What is 20% of 80?",
      type: "multiple_choice",
      options: ["16", "4", "100", "160"],
      correctAnswer: "16",
      explanation: "0.20 × 80 = 16.",
    },
    {
      nodeSlug: "quadratic-functions-sat",
      prompt: "The vertex of y = x² - 4x + 3 is at x = 2.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Vertex x = -b/(2a) = 4/2 = 2.",
    },
    {
      nodeSlug: "area-volume",
      prompt: "The area of a rectangle with length 6 and width 4 is 24.",
      type: "true_false",
      options: null,
      correctAnswer: "true",
      explanation: "Area = length × width = 6 × 4 = 24.",
    },
  ],
};

const BADGES = [
  { slug: "first-diagnostic", title: "First Diagnostic", description: "Completed your first diagnostic", icon: "🎯" },
  { slug: "7-day-streak", title: "7-Day Streak", description: "Studied for 7 days in a row", icon: "🔥" },
  { slug: "mission-finisher", title: "Mission Finisher", description: "Completed your first mission", icon: "✅" },
  { slug: "top-contributor", title: "Top Contributor", description: "Uploaded 10+ resources", icon: "🌟" },
  { slug: "stoichiometry-master", title: "Stoichiometry Master", description: "Mastered stoichiometry", icon: "⚗️" },
];

async function seed() {
  console.log("Seeding database...");

  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      create: badge,
      update: badge,
    });
  }
  console.log("Badges seeded");

  for (const subj of SUBJECTS) {
    const subject = await prisma.subject.upsert({
      where: { slug: subj.slug },
      create: { ...subj, status: "published" },
      update: { ...subj, status: "published" },
    });

    const SUBJECT_CONTENT: Record<
      string,
      {
        clusters: typeof algebraClusters;
        nodes: typeof algebraNodes;
        edges: typeof algebraEdges;
      }
    > = {
      algebra: { clusters: algebraClusters, nodes: algebraNodes, edges: algebraEdges },
      biology: { clusters: biologyClusters, nodes: biologyNodes, edges: biologyEdges },
      chemistry: { clusters: chemistryClusters, nodes: chemistryNodes, edges: chemistryEdges },
      "computer-science": {
        clusters: computerScienceClusters,
        nodes: computerScienceNodes,
        edges: computerScienceEdges,
      },
      physics: { clusters: physicsClusters, nodes: physicsNodes, edges: physicsEdges },
      "sat-math": { clusters: satMathClusters, nodes: satMathNodes, edges: satMathEdges },
    };
    const { clusters: clusterData, nodes: nodeData, edges: edgeData } =
      SUBJECT_CONTENT[subj.slug] ?? { clusters: [], nodes: [], edges: [] };

    const clusterMap: Record<string, string> = {};
    for (const c of clusterData) {
      const cluster = await prisma.cluster.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: c.slug } },
        create: {
          subjectId: subject.id,
          slug: c.slug,
          title: c.title,
          description: c.description,
          orderIndex: c.orderIndex,
        },
        update: { title: c.title, description: c.description, orderIndex: c.orderIndex },
      });
      clusterMap[c.slug] = cluster.id;
    }

    const nodeMap: Record<string, string> = {};
    for (const n of nodeData) {
      const clusterId = clusterMap[n.clusterSlug];
      if (!clusterId) continue;
      const node = await prisma.conceptNode.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: n.slug } },
        create: {
          subjectId: subject.id,
          clusterId,
          slug: n.slug,
          title: n.title,
          description: `Learn ${n.title} - essential concept for mastery.`,
          orderIndex: n.orderIndex,
        },
        update: { title: n.title, orderIndex: n.orderIndex },
      });
      nodeMap[n.slug] = node.id;
    }

    for (const e of edgeData) {
      const sourceId = nodeMap[e.source];
      const targetId = nodeMap[e.target];
      if (!sourceId || !targetId) continue;
      await prisma.conceptEdge.upsert({
        where: {
          subjectId_sourceNodeId_targetNodeId: {
            subjectId: subject.id,
            sourceNodeId: sourceId,
            targetNodeId: targetId,
          },
        },
        create: {
          subjectId: subject.id,
          sourceNodeId: sourceId,
          targetNodeId: targetId,
          relationshipType: e.type,
        },
        update: { relationshipType: e.type },
      });
    }

    const questions = DIAGNOSTIC_QUESTIONS[subj.slug] ?? [];
    for (const q of questions) {
      const nodeId = nodeMap[q.nodeSlug];
      if (!nodeId) continue;
      await prisma.diagnosticQuestion.create({
        data: {
          subjectId: subject.id,
          nodeId,
          prompt: q.prompt,
          type: q.type,
          optionsJson: q.options ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        },
      });
    }

    console.log(`Subject ${subj.slug} seeded`);
  }

  const demoPassword = await bcrypt.hash("demo1234", 10);
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const superAdminPassword = await bcrypt.hash("superadmin1234", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@mindorbit.learn" },
    create: {
      email: "demo@mindorbit.learn",
      name: "Demo Student",
      passwordHash: demoPassword,
      gradeLevel: "11",
      studyGoal: "SAT prep",
      onboardingCompleted: true,
      xp: 150,
      streakCount: 3,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: "admin@mindorbit.learn" },
    create: {
      email: "admin@mindorbit.learn",
      name: "Admin User",
      passwordHash: adminPassword,
      role: "ADMIN",
      onboardingCompleted: true,
    },
    update: { role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "superadmin@mindorbit.learn" },
    create: {
      email: "superadmin@mindorbit.learn",
      name: "Super Admin",
      passwordHash: superAdminPassword,
      role: "SUPER_ADMIN",
      onboardingCompleted: true,
    },
    update: { role: "SUPER_ADMIN" },
  });

  await prisma.userBadge.upsert({
    where: {
      userId_badgeId: {
        userId: demoUser.id,
        badgeId: (await prisma.badge.findUnique({ where: { slug: "first-diagnostic" } }))!.id,
      },
    },
    create: {
      userId: demoUser.id,
      badgeId: (await prisma.badge.findUnique({ where: { slug: "first-diagnostic" } }))!.id,
    },
    update: {},
  });

  const chemistrySubject = await prisma.subject.findUnique({ where: { slug: "chemistry" } });
  if (chemistrySubject) {
    const chemistryCluster = await prisma.cluster.findFirst({
      where: { subjectId: chemistrySubject.id, slug: "stoichiometry" },
    });
    const moleNode = await prisma.conceptNode.findFirst({
      where: { subjectId: chemistrySubject.id, slug: "mole-concept" },
    });
    const stoichiometryNode = await prisma.conceptNode.findFirst({
      where: { subjectId: chemistrySubject.id, slug: "stoichiometry-calc" },
    });
    if (chemistryCluster && moleNode) {
      await prisma.resource.create({
        data: {
          userId: demoUser.id,
          subjectId: chemistrySubject.id,
          clusterId: chemistryCluster.id,
          nodeId: moleNode.id,
          type: "note",
          title: "Mole Concept Quick Reference",
          description: "Essential formulas and examples for the mole concept",
          status: "approved",
          contentJson: JSON.stringify({
            markdown: `## Mole Concept\n\n- 1 mole = 6.022 × 10²³ particles\n- Moles = mass / molar mass\n- Molar volume of gas at STP = 22.4 L`,
          }),
        },
      });
      if (stoichiometryNode) {
        await prisma.resource.create({
          data: {
            userId: demoUser.id,
            subjectId: chemistrySubject.id,
            clusterId: chemistryCluster.id,
            nodeId: stoichiometryNode.id,
            type: "summary",
            title: "Stoichiometry Step-by-Step",
            description: "How to solve stoichiometry problems",
            status: "approved",
            contentJson: JSON.stringify({
              markdown: `## Stoichiometry\n\n1. Balance the equation\n2. Convert to moles\n3. Use mole ratio\n4. Convert to desired unit`,
            }),
          },
        });
      }
    }
  }

  console.log("Demo user, admin users, and resources seeded");
  console.log("Seed complete.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
