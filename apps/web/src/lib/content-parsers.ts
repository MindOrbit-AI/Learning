/**
 * Content Parsers - Extract text from PDF, YouTube, images, and raw text sources
 * Used by the Content Ingestion Engine
 */

import { getAIProvider } from "@mindorbit/ai";
import { youtubeTranscriptService } from "../services/youtube-transcript-service";

export type { TranscriptSegment } from "../services/youtube-transcript-service";

export type ParseResult = { text: string; metadata?: Record<string, unknown> };

export const contentParsers = {
  /**
   * Parse PDF buffer to plain text
   */
  async parsePdf(buffer: Buffer): Promise<ParseResult> {
    // @ts-expect-error - pdf-parse has no declaration file
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return {
      text: data.text ?? "",
      metadata: { numpages: data.numpages, info: data.info },
    };
  },

  /**
   * Parse YouTube video URL to transcript text.
   * Delegates to youtube-transcript-service (package first, direct InnerTube fallback).
   */
  async parseYouTube(url: string): Promise<ParseResult> {
    const result = await youtubeTranscriptService.getTranscript(url);
    const videoId = youtubeTranscriptService.getVideoId(url);
    return {
      text: result.text,
      metadata: {
        videoId,
        segments: result.segments.length,
        segmentTimestamps: result.segments.map((s) => ({ startMs: s.startMs, text: s.text })),
      },
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
    return youtubeTranscriptService.getVideoId(url);
  },

  /**
   * Check if a string is a YouTube URL
   */
  isYouTubeUrl(url: string): boolean {
    return youtubeTranscriptService.isYouTubeUrl(url);
  },
};
