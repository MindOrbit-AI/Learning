/**
 * Content Parsers - Extract text from PDF, YouTube, images, and raw text sources
 * Used by the Content Ingestion Engine
 */

import { getAIProvider } from "@mindorbit/ai";

const YOUTUBE_URL_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export type ParseResult = { text: string; metadata?: Record<string, unknown> };

export const contentParsers = {
  /**
   * Parse PDF buffer to plain text
   */
  async parsePdf(buffer: Buffer): Promise<ParseResult> {
    // Dynamic import - pdf-parse is CommonJS and may not work in Edge
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return {
      text: data.text ?? "",
      metadata: { numpages: data.numpages, info: data.info },
    };
  },

  /**
   * Parse YouTube video URL to transcript text
   */
  async parseYouTube(url: string): Promise<ParseResult> {
    const match = url.match(YOUTUBE_URL_REGEX);
    const videoId = match?.[1];
    if (!videoId) {
      throw new Error("Invalid YouTube URL. Use format: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID");
    }

    const { YoutubeTranscript } = await import("youtube-transcript");
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const text = transcript
      .map((item) => (typeof item === "string" ? item : item.text))
      .join("\n");
    return {
      text,
      metadata: { videoId, segments: transcript.length },
    };
  },

  /**
   * Extract text from image using AI vision (diagrams, notes, screenshots)
   */
  async parseImage(buffer: Buffer, mimeType: string): Promise<ParseResult> {
    const text = await getAIProvider().extractTextFromImage(buffer, mimeType);
    return {
      text,
      metadata: { mimeType, sizeBytes: buffer.length },
    };
  },

  /**
   * Pass-through for raw text (lecture notes, textbook paste)
   */
  parseText(content: string): ParseResult {
    return { text: content.trim(), metadata: { length: content.length } };
  },

  /**
   * Extract YouTube video ID from URL
   */
  extractYouTubeId(url: string): string | null {
    const match = url.match(YOUTUBE_URL_REGEX);
    return match?.[1] ?? null;
  },

  /**
   * Check if a string is a YouTube URL
   */
  isYouTubeUrl(url: string): boolean {
    return YOUTUBE_URL_REGEX.test(url);
  },
};
