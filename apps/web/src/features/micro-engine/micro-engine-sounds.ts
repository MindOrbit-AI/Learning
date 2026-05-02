import { arenaSounds } from "@/features/concept-arena/concept-arena-sounds";

/** Optional Web Audio hooks (same lightweight beeps as Concept Arena). */
export const microEngineSounds = {
  resume: () => arenaSounds.resume(),
  correct: () => arenaSounds.correct(),
  wrong: () => arenaSounds.wrong(),
  complete: () => arenaSounds.win(),
};
