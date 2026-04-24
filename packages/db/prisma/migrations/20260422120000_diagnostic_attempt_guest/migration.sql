-- Allow guest (marketing) diagnostic attempts without a user row.
ALTER TABLE "DiagnosticAttempt" ALTER COLUMN "userId" DROP NOT NULL;
