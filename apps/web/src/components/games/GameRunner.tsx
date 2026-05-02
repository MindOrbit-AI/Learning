"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GameMode } from "@prisma/client";
import { GameHUD } from "@/components/games/GameHUD";
import { GameProgress } from "@/components/games/GameProgress";
import type { ClientRuntimeState, PostGameEventFn } from "@/features/interactive-games/runner-types";
import { AdaptiveQuizEngine } from "@/components/games/modes/AdaptiveQuizEngine";
import { SpeedRunMastery } from "@/components/games/modes/SpeedRunMastery";
import { ConceptBattleArena } from "@/components/games/modes/ConceptBattleArena";
import { BuildTheSystem } from "@/components/games/modes/BuildTheSystem";
import { FindTheMistake } from "@/components/games/modes/FindTheMistake";
import { PuzzlePath } from "@/components/games/modes/PuzzlePath";
import { SimulationLab } from "@/components/games/modes/SimulationLab";
import { DecisionSimulator } from "@/components/games/modes/DecisionSimulator";
import { LabEscapeRoom } from "@/components/games/modes/LabEscapeRoom";
import { VisualBuilderChallenge } from "@/components/games/modes/VisualBuilderChallenge";

type GamePayload = {
  id: string;
  title: string;
  description: string;
  gameMode: GameMode;
  config: Record<string, unknown>;
};

export function GameRunner({ gameId, userXp }: { gameId: string; userXp: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [game, setGame] = useState<GamePayload | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<ClientRuntimeState | null>(null);
  const [score, setScore] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [qTotal, setQTotal] = useState(4);
  const completing = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/games/${gameId}`);
      const data = (await res.json()) as {
        game?: GamePayload;
        attempt?: { id: string; currentState: ClientRuntimeState; score: number; xpEarned: number } | null;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Failed to load game");
      if (!data.game) throw new Error("Missing game");
      setGame(data.game);
      const cfg = data.game.config as Record<string, unknown>;
      const gc = (cfg.gameConfig as Record<string, unknown>) ?? {};
      const mode = data.game.gameMode;
      const n =
        mode === "FIND_MISTAKE" || mode === "BUILD_SYSTEM" || mode === "VISUAL_BUILDER"
          ? 1
          : mode === "DECISION_SIMULATOR" && Array.isArray(gc.states)
            ? Math.max(
                1,
                gc.states.filter((s) => {
                  const o = s as Record<string, unknown>;
                  return Array.isArray(o.choices) && o.choices.length > 0;
                }).length
              )
            : mode === "PUZZLE_PATH" && Array.isArray(gc.nodes)
              ? gc.nodes.length
              : mode === "LAB_ESCAPE_ROOM" && Array.isArray(gc.rooms)
                ? gc.rooms.length
                : (Array.isArray(gc.questions) ? gc.questions.length : 0) ||
                  (Array.isArray(gc.rounds) ? gc.rounds.length : 0) ||
                  4;
      setQTotal(Math.max(1, n));

      if (data.attempt?.id) {
        setAttemptId(data.attempt.id);
        setRuntime(data.attempt.currentState as ClientRuntimeState);
        setScore(data.attempt.score);
        setSessionXp(data.attempt.xpEarned);
      } else {
        const st = await fetch(`/api/games/${gameId}/start`, { method: "POST" });
        const stJson = (await st.json()) as {
          attemptId?: string;
          state?: ClientRuntimeState;
          error?: string;
        };
        if (!st.ok) throw new Error(stJson.error ?? "Could not start attempt");
        setAttemptId(stJson.attemptId ?? null);
        setRuntime(stJson.state ?? null);
        setScore(stJson.state?.score ?? 0);
        setSessionXp(stJson.state?.xp ?? 0);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    void load();
  }, [load]);

  const postEvent: PostGameEventFn = useCallback(
    async (input) => {
      if (!attemptId) throw new Error("No attempt");
      const res = await fetch(`/api/games/${gameId}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, ...input }),
      });
      const j = (await res.json()) as { state?: ClientRuntimeState; score?: number; xp?: number; error?: string };
      if (!res.ok) throw new Error(j.error ?? "event failed");
      if (j.state) setRuntime(j.state);
      if (typeof j.score === "number") setScore(j.score);
      if (typeof j.xp === "number") setSessionXp(j.xp);
      return { state: j.state as ClientRuntimeState, score: j.score ?? 0, xp: j.xp ?? 0 };
    },
    [attemptId, gameId]
  );

  const onCompleteSession = useCallback(async () => {
    if (!attemptId || completing.current) return;
    completing.current = true;
    const res = await fetch(`/api/games/${gameId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    });
    if (!res.ok) {
      completing.current = false;
      const j = (await res.json()) as { error?: string };
      setErr(j.error ?? "Complete failed");
      return;
    }
    router.push(`/games/results/${attemptId}`);
  }, [attemptId, gameId, router]);

  const setScoreXp = useCallback((s: number, x: number) => {
    setScore(s);
    setSessionXp(x);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">
        <div className="text-center text-sm">Calibrating game shell…</div>
      </div>
    );
  }

  if (err || !game || !runtime || !attemptId) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-500/30 bg-rose-950/30 p-6 text-center text-rose-100">
        <p className="font-semibold">{err ?? "Unable to start this game."}</p>
        <button type="button" className="mt-4 text-sm underline" onClick={() => void load()}>
          Retry
        </button>
      </div>
    );
  }

  const modeProps = {
    gameId,
    attemptId,
    gameMode: game.gameMode,
    envelope: game.config as Record<string, unknown>,
    runtime,
    setRuntime,
    setScoreXp,
    postEvent,
    onCompleteSession,
  };

  let body: React.ReactNode = null;
  switch (game.gameMode) {
    case "ADAPTIVE_QUIZ":
      body = <AdaptiveQuizEngine {...modeProps} />;
      break;
    case "SPEED_RUN":
      body = <SpeedRunMastery {...modeProps} />;
      break;
    case "CONCEPT_BATTLE":
      body = <ConceptBattleArena {...modeProps} />;
      break;
    case "BUILD_SYSTEM":
      body = <BuildTheSystem {...modeProps} />;
      break;
    case "FIND_MISTAKE":
      body = <FindTheMistake {...modeProps} />;
      break;
    case "PUZZLE_PATH":
      body = <PuzzlePath {...modeProps} />;
      break;
    case "SIMULATION_LAB":
      body = <SimulationLab {...modeProps} />;
      break;
    case "DECISION_SIMULATOR":
      body = <DecisionSimulator {...modeProps} />;
      break;
    case "LAB_ESCAPE_ROOM":
      body = <LabEscapeRoom {...modeProps} />;
      break;
    case "VISUAL_BUILDER":
      body = <VisualBuilderChallenge {...modeProps} />;
      break;
    default:
      body = <AdaptiveQuizEngine {...modeProps} />;
  }

  const idx = runtime.currentQuestionIndex ?? 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <GameHUD
        title={game.title}
        subtitle={game.description}
        score={score}
        sessionXp={sessionXp}
        userXp={userXp}
      />
      {game.gameMode !== "BUILD_SYSTEM" &&
      game.gameMode !== "FIND_MISTAKE" &&
      game.gameMode !== "SIMULATION_LAB" &&
      game.gameMode !== "VISUAL_BUILDER" ? (
        <GameProgress
          label={
            game.gameMode === "DECISION_SIMULATOR"
              ? "Branch depth"
              : game.gameMode === "LAB_ESCAPE_ROOM"
                ? "Escape progress"
                : "Question flow"
          }
          value={Math.min(idx + 1, qTotal)}
          max={qTotal}
        />
      ) : null}
      {body}
    </div>
  );
}
