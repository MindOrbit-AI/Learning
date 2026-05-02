-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('CONCEPT_BATTLE', 'SPEED_RUN', 'BUILD_SYSTEM', 'FIND_MISTAKE', 'PUZZLE_PATH', 'SIMULATION_LAB', 'DECISION_SIMULATOR', 'LAB_ESCAPE_ROOM', 'VISUAL_BUILDER', 'ADAPTIVE_QUIZ');

-- CreateEnum
CREATE TYPE "GameRunStatus" AS ENUM ('draft', 'active', 'completed');

-- CreateEnum
CREATE TYPE "GameRewardType" AS ENUM ('xp', 'badge', 'streak', 'unlock');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "learningGoal" TEXT NOT NULL,
    "gameMode" "GameMode" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conceptNodeId" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "status" "GameRunStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION,
    "currentState" JSONB NOT NULL DEFAULT '{}',
    "masteryDelta" JSONB,
    "weakConcepts" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEvent" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB,
    "isCorrect" BOOLEAN,
    "responseTimeMs" INTEGER,
    "conceptNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameReward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "type" "GameRewardType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Game_userId_createdAt_idx" ON "Game"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Game_subjectId_idx" ON "Game"("subjectId");

-- CreateIndex
CREATE INDEX "GameAttempt_userId_gameId_idx" ON "GameAttempt"("userId", "gameId");

-- CreateIndex
CREATE INDEX "GameAttempt_gameId_completedAt_idx" ON "GameAttempt"("gameId", "completedAt");

-- CreateIndex
CREATE INDEX "GameEvent_attemptId_createdAt_idx" ON "GameEvent"("attemptId", "createdAt");

-- CreateIndex
CREATE INDEX "GameReward_userId_createdAt_idx" ON "GameReward"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "GameReward_attemptId_idx" ON "GameReward"("attemptId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_conceptNodeId_fkey" FOREIGN KEY ("conceptNodeId") REFERENCES "ConceptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAttempt" ADD CONSTRAINT "GameAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "GameAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameEvent" ADD CONSTRAINT "GameEvent_conceptNodeId_fkey" FOREIGN KEY ("conceptNodeId") REFERENCES "ConceptNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameReward" ADD CONSTRAINT "GameReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameReward" ADD CONSTRAINT "GameReward_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "GameAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
