import type { GenerateSongRequest } from "../models/types.js";

export function buildMusicPrompt(input: GenerateSongRequest): string {
  const { title, explanation, difficulty } = input;
  return `You are a cognitive learning system that converts knowledge into music for memory retention.

INPUT:
- Concept: ${title}
- Explanation: ${explanation}
- Difficulty: ${difficulty}

OUTPUT STRICT JSON (no markdown, no code fences, only the JSON object):

{
  "rap": {
    "verse": "...",
    "hook": "...",
    "bpm": 90,
    "style": "hip-hop | trap | lo-fi"
  },
  "chant": {
    "lines": ["...", "..."],
    "rhythmPattern": "clap-rest-clap"
  },
  "melody": {
    "lyrics": "...",
    "tone": "emotional | uplifting | calm"
  },
  "reinforcement": {
    "boost": "5-minute recall exercise",
    "recall": "trigger phrase for memory"
  }
}

Rules:
- Keep lines short and rhythmic
- Emphasize key concepts repeatedly
- Use simple language for beginner, technical for advanced
- Make it catchy and easy to memorize
- Avoid fluff
- bpm must be a single integer from 90 to 140 inclusive
- rap.style must be exactly one of: "hip-hop", "trap", "lo-fi"
- melody.tone must be exactly one of: "emotional", "uplifting", "calm"`;
}
