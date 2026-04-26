"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@mindorbit/ui";
import { Brain } from "lucide-react";
import { safeInternalPath } from "@/lib/safe-internal-path";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ref = searchParams?.get("ref") ?? undefined;
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, ref }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign up failed");
        return;
      }
      const nextPath = safeInternalPath(searchParams?.get("callbackUrl"), "/onboarding");
      const callbackUrl = new URL(nextPath, window.location.origin).toString();
      const signInRes = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });
      if (signInRes?.error) {
        setError("Account created but sign in failed. Try signing in.");
        return;
      }
      router.push(nextPath);
      router.refresh();
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
          <CardTitle>Create account</CardTitle>
          <CardDescription>Get started with MindOrbit Learn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link
              href={
                searchParams?.toString()
                  ? `/auth/signin?${searchParams.toString()}`
                  : "/auth/signin"
              }
              className="text-primary hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
