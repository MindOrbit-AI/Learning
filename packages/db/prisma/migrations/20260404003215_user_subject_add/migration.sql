-- CreateTable
CREATE TABLE "UserSubjectAdd" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubjectAdd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSubjectAdd_userId_idx" ON "UserSubjectAdd"("userId");

-- CreateIndex
CREATE INDEX "UserSubjectAdd_subjectId_idx" ON "UserSubjectAdd"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubjectAdd_userId_subjectId_key" ON "UserSubjectAdd"("userId", "subjectId");

-- AddForeignKey
ALTER TABLE "UserSubjectAdd" ADD CONSTRAINT "UserSubjectAdd_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubjectAdd" ADD CONSTRAINT "UserSubjectAdd_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
