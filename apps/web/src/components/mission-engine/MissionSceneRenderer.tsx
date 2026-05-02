"use client";

import type { MissionSceneData, SceneType } from "@mindorbit/types";
import { DragDropScene } from "./scenes/DragDropScene";
import { SliderExperimentScene } from "./scenes/SliderExperimentScene";
import { TapHighlightScene } from "./scenes/TapHighlightScene";
import { SortSequenceScene } from "./scenes/SortSequenceScene";
import { FindErrorScene } from "./scenes/FindErrorScene";
import { ConstructAnswerScene } from "./scenes/ConstructAnswerScene";
import { ReflectionScene } from "./scenes/ReflectionScene";
import { MicroQuizScene } from "./scenes/MicroQuizScene";
import { ObserveScene } from "./scenes/ObserveScene";
import { RevealScene } from "./scenes/RevealScene";
import { TransferChallengeScene } from "./scenes/TransferChallengeScene";
import { PredictionCard } from "./scenes/PredictionCard";
import { ManipulationCanvas } from "./scenes/ManipulationCanvas";

interface MissionSceneRendererProps {
  scene: MissionSceneData;
  answer: unknown;
  onAnswer: (answer: unknown) => void;
  disabled?: boolean;
}

export function MissionSceneRenderer({
  scene,
  answer,
  onAnswer,
  disabled = false,
}: MissionSceneRendererProps) {
  const content = scene.contentJson
    ? (JSON.parse(scene.contentJson) as Record<string, unknown>)
    : {};
  const correctAnswer = scene.correctAnswerJson
    ? JSON.parse(scene.correctAnswerJson) as unknown
    : undefined;

  switch (scene.sceneType) {
    case "observe":
      return (
        <ObserveScene
          content={content as { visual?: string; description?: string }}
        />
      );

    case "reveal":
      return (
        <RevealScene
          content={(content.visual ?? content.description ?? content.text ?? "") as string}
          label={(content.label as string) ?? "Reveal"}
        />
      );

    case "predict": {
      const predictOptions = (content.options ?? []) as Array<{ id?: string; label?: string } | string>;
      if (predictOptions.length === 0) {
        return (
          <ConstructAnswerScene
            content={{ placeholder: "Type your answer..." }}
            onAnswer={(a) => onAnswer(a)}
            disabled={disabled}
          />
        );
      }
      return (
        <PredictionCard
          options={predictOptions}
          selected={answer as string | undefined}
          onSelect={(id) => onAnswer(id)}
          disabled={disabled}
        />
      );
    }

    case "micro_quiz": {
      const quizOptions = (content.options ?? []) as Array<{ id?: string; label?: string } | string>;
      if (quizOptions.length === 0) {
        return (
          <ConstructAnswerScene
            content={{ placeholder: "Type your answer..." }}
            onAnswer={(a) => onAnswer(a)}
            disabled={disabled}
          />
        );
      }
      return (
        <MicroQuizScene
          content={content as { options?: Array<{ id: string; label: string }> }}
          correctAnswer={correctAnswer as string | undefined}
          initialAnswer={(answer as string) ?? undefined}
          onAnswer={(a) => onAnswer(a)}
          disabled={disabled}
        />
      );
    }

    case "drag_drop":
      return (
        <DragDropScene
          content={content as import("@mindorbit/types").DragDropContent}
          correctAnswer={correctAnswer as number[] | string[] | undefined}
          onAnswer={(a) => onAnswer(a)}
          disabled={disabled}
        />
      );

    case "slider_experiment":
      return (
        <SliderExperimentScene
          content={content as import("@mindorbit/types").SliderContent}
          onAnswer={(v) => onAnswer(v)}
          disabled={disabled}
        />
      );

    case "tap_highlight":
      return (
        <TapHighlightScene
          content={content as import("@mindorbit/types").TapHighlightContent}
          onAnswer={(ids) => onAnswer(ids)}
          disabled={disabled}
          highlightOrder={content.highlightOrder as boolean | undefined}
        />
      );

    case "sort_sequence":
      return (
        <SortSequenceScene
          content={{ ...content, prompt: scene.prompt }}
          onAnswer={(order) => onAnswer(order)}
          disabled={disabled}
        />
      );

    case "find_error":
      return (
        <FindErrorScene
          content={{ ...content, prompt: scene.prompt }}
          onAnswer={(id) => onAnswer(id)}
          disabled={disabled}
        />
      );

    case "construct_answer":
      return (
        <ConstructAnswerScene
          content={content as { placeholder?: string; expectedFormat?: string }}
          onAnswer={(a) => onAnswer(a)}
          disabled={disabled}
        />
      );

    case "reflect":
      return (
        <ReflectionScene
          prompt={scene.prompt}
          onAnswer={(r) => onAnswer(r)}
          disabled={disabled}
        />
      );

    case "transfer":
      return (
        <TransferChallengeScene
          content={content}
          options={(content.options ?? []) as Array<{ id: string; label: string }>}
          onAnswer={(a) => onAnswer(a)}
          disabled={disabled}
        />
      );

    case "manipulate":
      return (
        <ManipulationCanvas>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{scene.prompt}</p>
            <input
              type="text"
              placeholder="Your response..."
              onChange={(e) => onAnswer(e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
        </ManipulationCanvas>
      );

    case "visual_problem":
      return (
        <div className="space-y-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Visual-first problem</p>
          <p className="text-sm text-muted-foreground">
            This step is designed for the Micro lesson runner (picture first, then answer). Open the mission
            from Missions or the mastery map with scene-based mode to interact with the full workspace.
          </p>
          <ConstructAnswerScene
            content={{ placeholder: "Placeholder answer (use lesson runner for visuals)…" }}
            onAnswer={(a) => onAnswer(a)}
            disabled={disabled}
          />
        </div>
      );

    case "simulate":
      return (
        <ManipulationCanvas>
          <p className="text-muted-foreground">{scene.prompt}</p>
          <p className="mt-2 text-sm">Simulation placeholder—configure per subject</p>
        </ManipulationCanvas>
      );

    default:
      return (
        <div className="rounded-xl border bg-muted/30 p-6">
          <p className="text-muted-foreground">{scene.prompt}</p>
          <input
            type="text"
            placeholder="Your answer..."
            value={(answer as string) ?? ""}
            onChange={(e) => onAnswer(e.target.value)}
            disabled={disabled}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          />
        </div>
      );
  }
}
