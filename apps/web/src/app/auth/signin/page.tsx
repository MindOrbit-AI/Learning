"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@mindorbit/ui";
import { Brain } from "lucide-react";
import { safeInternalPath } from "@/lib/safe-internal-path";

function SignInForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const callbackUrl = safeInternalPath(
        searchParams?.get("callbackUrl"),
        "/dashboard"
      );
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });
      if (!res) {
        setError("Sign in request failed. Please try again.");
        return;
      }
      if (res.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "Sign in failed. Please try again."
        );
        return;
      }

      const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
      const session = (await sessionRes.json()) as
        | { user?: { id?: string } | null }
        | null;

      if (!sessionRes.ok || !session?.user?.id) {
        setError("Signed in, but we couldn't establish your session. Please try again.");
        return;
      }

      // Full navigation avoids soft-navigation edge cases (e.g. stuck transition layers) after session is set.
      window.location.assign(callbackUrl);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-primary/5 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-bold">
        <Brain className="h-8 w-8 text-primary" />
        MindOrbit Learn
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link
              href={
                searchParams?.toString()
                  ? `/auth/signup?${searchParams.toString()}`
                  : "/auth/signup"
              }
              className="text-primary hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
