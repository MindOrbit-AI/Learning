-- CreateTable
CREATE TABLE "ConceptArenaStat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "totalDamageDealt" INTEGER NOT NULL DEFAULT 0,
    "bestCombo" INTEGER NOT NULL DEFAULT 0,
    "matchesPlayed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptArenaStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConceptArenaStat_userId_key" ON "ConceptArenaStat"("userId");

-- CreateIndex
CREATE INDEX "ConceptArenaStat_wins_idx" ON "ConceptArenaStat"("wins");

-- CreateIndex
CREATE INDEX "ConceptArenaStat_totalDamageDealt_idx" ON "ConceptArenaStat"("totalDamageDealt");

-- AddForeignKey
ALTER TABLE "ConceptArenaStat" ADD CONSTRAINT "ConceptArenaStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
