-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bestMissionStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastMissionCompletedAt" TIMESTAMP(3);
