"use client";

import { DiagnosticRunClient } from "@/features/diagnostics/diagnostic-run-client";

export default function DiagnosticRunPage() {
  return (
    <DiagnosticRunClient
      diagnosticsApiBase="/api/diagnostics"
      resultsPathForAttempt={(slug, attemptId) =>
        `/diagnostics/${slug}/results?attemptId=${attemptId}`
      }
      backToSubjectHref={(slug) => `/subjects/${slug}`}
      showUpgradeOnLimit
    />
  );
}
