"use client";

import { useEffect, useRef } from "react";

/** Primes HttpOnly cookie for linking this guest attempt after sign-up (results page only). */
export function PrimeGuestClaimCookie({
  attemptId,
  subjectSlug,
}: {
  attemptId: string;
  subjectSlug: string;
}) {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    void fetch("/api/marketing/diagnostics/prime-claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ attemptId, subjectSlug }),
    });
  }, [attemptId, subjectSlug]);
  return null;
}
