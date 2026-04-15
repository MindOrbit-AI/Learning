"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@mindorbit/ui";
import { MasteryMapVisual } from "./mastery-map-visual";

const ease = [0.22, 1, 0.36, 1] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14 md:pt-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary"
            >
              For students who want real progress
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease }}
              className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]"
            >
              Build a Mind That Compounds
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              See where you are weak, what to study next, and how to lock it in—so you spend
              time on the gaps that actually raise your grades and exam scores.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link href="/auth/signup" className="sm:flex-initial">
                <Button size="lg" className="h-12 w-full gap-2 px-8 sm:w-auto">
                  Start Free Diagnostic
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full gap-2 border-white/15 bg-transparent sm:w-auto"
                >
                  See How It Works
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl" />
            <MasteryMapVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
