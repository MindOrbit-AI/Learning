import Link from "next/link";
import { Button } from "@mindorbit/ui";
import { Brain, Target, Zap, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Brain className="h-8 w-8 text-primary" />
          MindOrbit Learn
        </Link>
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cognitive Mastery
            </span>{" "}
            Network
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Not just notes—diagnose, map, and master every concept. Take a 5-minute
            diagnostic, see your mastery map, and receive AI-powered learning missions.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Target,
              title: "Diagnostic First",
              desc: "5-minute assessments reveal exactly where you stand",
            },
            {
              icon: Brain,
              title: "Mastery Map",
              desc: "Visual concept graph with node states and prerequisites",
            },
            {
              icon: Zap,
              title: "Learning Missions",
              desc: "AI-generated missions for weak and missing nodes",
            },
            {
              icon: Users,
              title: "Community Notes",
              desc: "Study node-linked resources from top creators",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Icon className="mb-4 h-10 w-10 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-24 rounded-2xl border bg-card p-12 text-center">
          <h2 className="text-2xl font-bold">Ready to master your subjects?</h2>
          <p className="mt-2 text-muted-foreground">
            Join students who use MindOrbit to learn smarter.
          </p>
          <Link href="/auth/signup" className="mt-6 inline-block">
            <Button size="lg">Create free account</Button>
          </Link>
        </section>
      </main>

      <footer className="container mx-auto mt-24 border-t px-4 py-8 text-center text-sm text-muted-foreground">
        MindOrbit Learn © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
