"use client";

import { DiagnosticRunClient } from "@/features/diagnostics/diagnostic-run-client";

export default function MarketingDiagnosticRunPage() {
  return (
    <DiagnosticRunClient
      diagnosticsApiBase="/api/marketing/diagnostics"
      resultsPathForAttempt={(slug, attemptId) =>
        `/try-diagnostic/${slug}/results?attemptId=${attemptId}`
      }
      backToSubjectHref={() => "/try-diagnostic"}
      showUpgradeOnLimit={false}
    />
  );
}
