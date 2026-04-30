export type GenerateSongDifficulty = "beginner" | "intermediate" | "advanced";

export type GenerateSongRequest = {
  conceptId: string;
  title: string;
  explanation: string;
  difficulty: GenerateSongDifficulty;
};

export type MusicLearningAsset = {
  conceptId: string;
  rap: {
    verse: string;
    hook: string;
    bpm: number;
    style: string;
  };
  chant: {
    lines: string[];
    rhythmPattern: string;
  };
  melody: {
    lyrics: string;
    tone: string;
  };
  reinforcement: {
    boost: string;
    recall: string;
  };
};

/** Shape returned by the LLM before normalization (fields may be loose). */
export type LlmMusicPayload = {
  rap: { verse: string; hook: string; bpm: number | string; style: string };
  chant?: { lines?: Array<string | number>; rhythmPattern?: string };
  melody: { lyrics: string; tone: string };
  reinforcement: { boost: string; recall: string };
};
