-- Visual Problem Solving Engine: scene lessons, attempts, concept prerequisites, misconceptions

ALTER TABLE "ConceptNode" ADD COLUMN "prerequisitesJson" JSONB;

ALTER TABLE "UserNodeState" ADD COLUMN "misconceptionJson" JSONB;

CREATE TABLE "SceneLesson" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "subjectId" TEXT,
    "topic" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lessonJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SceneLesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SceneAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sceneLessonId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "userInputJson" JSONB NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "feedback" TEXT,
    "misconception" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SceneAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LessonAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sceneLessonId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "mistakesJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SceneLesson_userId_createdAt_idx" ON "SceneLesson"("userId", "createdAt");
CREATE INDEX "SceneLesson_subjectId_topic_idx" ON "SceneLesson"("subjectId", "topic");

CREATE INDEX "SceneAttempt_userId_sceneLessonId_idx" ON "SceneAttempt"("userId", "sceneLessonId");
CREATE INDEX "SceneAttempt_sceneLessonId_sceneId_idx" ON "SceneAttempt"("sceneLessonId", "sceneId");

CREATE INDEX "LessonAttempt_userId_sceneLessonId_idx" ON "LessonAttempt"("userId", "sceneLessonId");

ALTER TABLE "SceneLesson" ADD CONSTRAINT "SceneLesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SceneLesson" ADD CONSTRAINT "SceneLesson_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SceneAttempt" ADD CONSTRAINT "SceneAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SceneAttempt" ADD CONSTRAINT "SceneAttempt_sceneLessonId_fkey" FOREIGN KEY ("sceneLessonId") REFERENCES "SceneLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LessonAttempt" ADD CONSTRAINT "LessonAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonAttempt" ADD CONSTRAINT "LessonAttempt_sceneLessonId_fkey" FOREIGN KEY ("sceneLessonId") REFERENCES "SceneLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
