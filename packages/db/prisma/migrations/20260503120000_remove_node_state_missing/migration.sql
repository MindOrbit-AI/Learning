-- Migrate legacy `missing` rows to `weak`, then drop `missing` from NodeState enum (PostgreSQL).

UPDATE "UserNodeState" SET state = 'weak' WHERE state = 'missing';

ALTER TYPE "NodeState" RENAME TO "NodeState_old";

CREATE TYPE "NodeState" AS ENUM ('mastered', 'weak', 'learning', 'untouched');

ALTER TABLE "UserNodeState" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "UserNodeState" ALTER COLUMN "state" TYPE "NodeState" USING ("state"::text::"NodeState");
ALTER TABLE "UserNodeState" ALTER COLUMN "state" SET DEFAULT 'untouched'::"NodeState";

DROP TYPE "NodeState_old";
