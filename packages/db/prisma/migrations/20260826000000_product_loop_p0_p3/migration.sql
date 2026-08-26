-- Product loop P0-P3: review streaks, progress digest, calibrated items, intervention logs

ALTER TABLE "User" ADD COLUMN "reviewStreakCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "bestReviewStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lastReviewCompletedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "lastProgressDigestAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "masterySnapshotJson" JSONB;

ALTER TABLE "DiagnosticQuestion" ADD COLUMN "isCalibrated" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DiagnosticQuestion" ADD COLUMN "isEfficacyPanel" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DiagnosticQuestion" ADD COLUMN "panelOrder" INTEGER;
ALTER TABLE "DiagnosticQuestion" ADD COLUMN "sceneType" TEXT;

CREATE TABLE "NodeInterventionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "interventionType" TEXT NOT NULL,
    "missionType" TEXT,
    "misconceptionCategory" TEXT,
    "masteryBefore" DOUBLE PRECISION NOT NULL,
    "masteryAfter" DOUBLE PRECISION,
    "stateBefore" TEXT NOT NULL,
    "stateAfter" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NodeInterventionLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "NodeInterventionLog_userId_nodeId_idx" ON "NodeInterventionLog"("userId", "nodeId");
CREATE INDEX "NodeInterventionLog_userId_createdAt_idx" ON "NodeInterventionLog"("userId", "createdAt");

ALTER TABLE "NodeInterventionLog" ADD CONSTRAINT "NodeInterventionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
