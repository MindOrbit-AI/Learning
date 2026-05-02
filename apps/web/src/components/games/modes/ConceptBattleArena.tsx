"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { Shield, Sparkles, Swords, Wand2 } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { AnswerOptions } from "@/components/games/shared/AnswerOptions";
import { HealthBar } from "@/components/games/shared/HealthBar";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";
import { PowerUpButton } from "@/components/games/shared/PowerUpButton";
import { ComboMeter } from "@/components/games/shared/ComboMeter";

type Round = {
  question: string;
  choices: string[];
  correctAnswer: string;
  feedback: string;
  damage?: number;
  concept?: string;
  difficulty?: string;
};

export function ConceptBattleArena({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const rounds = useMemo(() => {
    const raw = gc.rounds;
    if (!Array.isArray(raw)) return [] as Round[];
    return raw
      .map((r) => {
        const o = r as Record<string, unknown>;
        const choices = Array.isArray(o.choices) ? (o.choices as string[]).filter(Boolean) : [];
        return {
          question: String(o.question ?? ""),
          choices,
          correctAnswer: String(o.correctAnswer ?? ""),
          feedback: String(o.feedback ?? ""),
          damage: o.damage != null ? Number(o.damage) : 22,
          concept: o.concept != null ? String(o.concept) : undefined,
          difficulty: o.difficulty != null ? String(o.difficulty) : "medium",
        };
      })
      .filter((x) => x.question && x.choices.length > 0);
  }, [gc.rounds]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shield, setShield] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [doubleDmg, setDoubleDmg] = useState(false);
  const t0 = useRef(Date.now());

  const round = rounds[idx] ?? null;
  const playerHp = runtime.playerHealth ?? 100;
  const foeHp = runtime.opponentHealth ?? 100;

  const fire = useCallback(
    async (choice: string) => {
      if (!round || reveal) return;
      setSelected(choice);
      setReveal(true);
      const ok = choice === round.correctAnswer;
      let dmg = round.damage ?? 22;
      if (ok && doubleDmg) dmg *= 2;
      const ms = Date.now() - t0.current;
      const res = await postEvent({
        eventType: "arena_round",
        payload: {
          questionIndex: idx,
          concept: round.concept,
          difficulty: round.difficulty,
          damage: ok ? dmg : 0,
          damageToPlayer: ok ? 0 : shield ? Math.floor((dmg * 2) / 3) : Math.floor(dmg * 0.75),
        },
        isCorrect: ok,
        responseTimeMs: ms,
      });
      setShield(false);
      setDoubleDmg(false);
      setRuntime(res.state);
      setScoreXp(res.score, res.xp);
      setToast(ok ? "Critical hit!" : round.feedback);
      t0.current = Date.now();
    },
    [round, reveal, idx, shield, doubleDmg, postEvent, setRuntime, setScoreXp]
  );

  const next = useCallback(() => {
    setToast(null);
    setSelected(null);
    setReveal(false);
    if ((runtime.opponentHealth ?? 100) <= 0 || (runtime.playerHealth ?? 100) <= 0) {
      void onCompleteSession();
      return;
    }
    if (idx + 1 >= rounds.length) {
      void onCompleteSession();
      return;
    }
    setIdx((i) => i + 1);
  }, [idx, rounds.length, runtime.opponentHealth, runtime.playerHealth, onCompleteSession]);

  if (!round) {
    return <div className="text-center text-zinc-500">Battle rounds missing from config.</div>;
  }

  return (
    <motion.div layout className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <HealthBar label="You" value={playerHp} colorClass="from-cyan-500 to-blue-500" />
        <HealthBar label="AI rival" value={foeHp} colorClass="from-fuchsia-500 to-rose-500" />
      </div>
      <div className="flex flex-wrap gap-2">
        <PowerUpButton
          label="Hint"
          icon={<Wand2 className="h-4 w-4" />}
          disabled={hintUsed || reveal}
          onClick={() => {
            setHintUsed(true);
            setToast("Hint: eliminate the two least precise options, then compare definitions carefully.");
          }}
        />
        <PowerUpButton
          label="Shield"
          icon={<Shield className="h-4 w-4" />}
          disabled={reveal}
          onClick={() => {
            setShield(true);
            setToast("Shield up — next wrong answer deals less damage.");
          }}
        />
        <PowerUpButton
          label="Double damage"
          icon={<Sparkles className="h-4 w-4" />}
          disabled={reveal}
          onClick={() => {
            setDoubleDmg(true);
            setToast("Power surge — next correct hit hits harder.");
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <Swords className="h-6 w-6 text-rose-400" />
        <ComboMeter combo={runtime.combo} />
      </div>
      <FeedbackToast message={toast} variant={toast?.includes("hit") ? "success" : toast ? "info" : "info"} />
      <div className="rounded-3xl border border-rose-500/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-rose-950/30 p-6">
        <p className="text-lg font-semibold text-zinc-50">{round.question}</p>
        <div className="mt-5">
          <AnswerOptions
            choices={round.choices}
            selected={selected}
            disabled={reveal}
            correctAnswer={round.correctAnswer}
            reveal={reveal}
            onSelect={(c) => void fire(c)}
          />
        </div>
        {reveal ? (
          <div className="mt-5 flex justify-end">
            <Button className="rounded-xl bg-rose-600 hover:bg-rose-500" type="button" onClick={next}>
              {idx + 1 >= rounds.length || playerHp <= 0 || foeHp <= 0 ? "End battle" : "Next round"}
            </Button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
