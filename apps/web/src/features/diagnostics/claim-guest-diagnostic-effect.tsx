"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Runs once after sign-in/up to attach a completed guest diagnostic to the account (HttpOnly cookie). */
export function ClaimGuestDiagnosticEffect() {
  const ran = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    void (async () => {
      const res = await fetch("/api/diagnostics/claim-guest", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!res.ok) return;
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (data.ok === true) router.refresh();
    })();
  }, [router]);

  return null;
}
