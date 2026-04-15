import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Atom,
  BarChart3,
  Calculator,
  Code2,
  Dna,
  FlaskConical,
  Globe2,
  Triangle,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const SUBJECTS: readonly {
  slug: string;
  title: string;
  color: string;
  icon: LucideIcon;
}[] = [
  { slug: "algebra", title: "Algebra", color: "#3B82F6", icon: Calculator },
  { slug: "geometry", title: "Geometry", color: "#8B5CF6", icon: Triangle },
  { slug: "biology", title: "Biology", color: "#22C55E", icon: Dna },
  { slug: "chemistry", title: "Chemistry", color: "#10B981", icon: FlaskConical },
  { slug: "computer-science", title: "Computer Science", color: "#8B5CF6", icon: Code2 },
  { slug: "physics", title: "Physics", color: "#F59E0B", icon: Atom },
  { slug: "world-history", title: "World History", color: "#F59E0B", icon: Globe2 },
  { slug: "sat-math", title: "SAT Math", color: "#EC4899", icon: BarChart3 },
];

export function DuoLandingSubjectsSection() {
  return (
    <section
      aria-label="Subjects"
      className="border-b border-border/60 bg-gradient-to-b from-background to-secondary/25 py-12 sm:py-16"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Subjects</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
            Pick a subject—your mastery map updates with you.
          </h2>
        </ScrollReveal>

        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {SUBJECTS.map((s, i) => {
            const Icon = s.icon;
            const signup = `/auth/signup?callbackUrl=${encodeURIComponent(`/subjects/${s.slug}`)}`;
            return (
              <li key={s.slug}>
                <ScrollReveal delay={0.04 * i} className="h-full">
                  <Link
                    href={signup}
                    className="flex h-full flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card px-3 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:px-4 sm:py-6"
                  >
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
                      style={{
                        backgroundColor: `${s.color}22`,
                        color: s.color,
                      }}
                    >
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden />
                    </span>
                    <span className="text-sm font-extrabold leading-tight text-foreground sm:text-base">
                      {s.title}
                    </span>
                  </Link>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
