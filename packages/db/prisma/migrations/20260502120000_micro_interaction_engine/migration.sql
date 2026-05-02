-- CreateEnum
CREATE TYPE "MicroInteractionType" AS ENUM (
  'tap_choice',
  'drag_match',
  'connect_nodes',
  'slider_adjust',
  'reveal_step',
  'fill_blank',
  'sequence_order',
  'visual_toggle'
);

-- CreateTable
CREATE TABLE "MicroLesson" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MicroLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroStep" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "type" "MicroInteractionType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "interactionConfig" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "feedbackCorrect" TEXT NOT NULL,
    "feedbackWrong" TEXT NOT NULL,
    "visualStateBefore" JSONB,
    "visualStateAfter" JSONB,
    "masterySkill" TEXT,

    CONSTRAINT "MicroStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MicroLesson_missionId_key" ON "MicroLesson"("missionId");

-- CreateIndex
CREATE INDEX "MicroStep_lessonId_orderIndex_idx" ON "MicroStep"("lessonId", "orderIndex");

-- AddForeignKey
ALTER TABLE "MicroLesson" ADD CONSTRAINT "MicroLesson_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroStep" ADD CONSTRAINT "MicroStep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "MicroLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
