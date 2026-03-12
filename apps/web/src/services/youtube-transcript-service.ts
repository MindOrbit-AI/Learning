/**
 * YouTube Transcript Service - Fetch transcripts with package + direct InnerTube fallback
 */

const YOUTUBE_URL_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const MIN_YOUTUBE_TRANSCRIPT_LENGTH = 50;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export type TranscriptSegment = { startMs: number; text: string };

export type TranscriptResult = { text: string; segments: TranscriptSegment[] };

function decodeXmlText(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

/** Fetch transcript via youtube-transcript package */
async function fetchTranscriptViaPackage(
  videoId: string
): Promise<TranscriptResult | null> {
  try {
    const { YoutubeTranscript } = await import("youtube-transcript");
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const segments: TranscriptSegment[] = transcript.map((item) => {
      const offsetSec =
        typeof item === "object" &&
        item &&
        typeof (item as { offset?: number }).offset === "number"
          ? (item as { offset: number }).offset
          : 0;
      return {
        startMs: Math.round(offsetSec * 1000),
        text: typeof item === "string" ? item : String((item as { text?: string })?.text ?? ""),
      };
    });
    const text = segments.map((s) => s.text).join("\n").replace(/\n+/g, "\n").trim();
    return { text, segments };
  } catch {
    return null;
  }
}

/** Fallback: fetch captions directly via InnerTube API */
async function fetchTranscriptDirect(
  videoId: string
): Promise<TranscriptResult | null> {
  let apiKey = "";
  try {
    const watchPage = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9" },
    });
    const html = await watchPage.text();
    const keyMatch =
      html.match(/"INNERTUBE_API_KEY":"([^"]+)"/) ?? html.match(/"apiKey":"([^"]+)"/);
    if (keyMatch?.[1]) apiKey = keyMatch[1];
  } catch {
    // continue without key
  }

  const playerUrl = apiKey
    ? `https://www.youtube.com/youtubei/v1/player?key=${apiKey}&prettyPrint=false`
    : "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";

  const tryPlayer = async (clientName: string, clientVersion: string) => {
    const res = await fetch(playerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
      },
      body: JSON.stringify({
        context: { client: { clientName, clientVersion, hl: "en" } },
        videoId,
      }),
    });
    if (!res.ok) return null;
    const raw: unknown = await res.json().catch(() => null);
    const data =
      (raw as { response?: unknown })?.response ??
      (Array.isArray(raw) ? raw[0] : raw) ??
      raw;
    return (
      data as {
        captions?: {
          playerCaptionsTracklistRenderer?: { captionTracks?: unknown[] };
        };
      }
    )?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  };

  let tracks: unknown[] | null | undefined = await tryPlayer("WEB", "2.20241219.00.00");
  if (!Array.isArray(tracks) || tracks.length === 0) {
    tracks = await tryPlayer("ANDROID", "20.10.38");
  }
  if (!Array.isArray(tracks) || tracks.length === 0) return null;

  type Track = { languageCode?: string; baseUrl?: string };
  const preferredLang = (t: Track) => (t.languageCode ?? "").toLowerCase().startsWith("en");
  const chosen = (tracks as Track[]).find(preferredLang) ?? (tracks as Track[])[0];
  const baseUrl = chosen?.baseUrl;
  if (!baseUrl) return null;

  const fetchCaption = async (useJson3: boolean): Promise<string> => {
    const captionUrl = useJson3
      ? (baseUrl.includes("?") ? `${baseUrl}&fmt=json3` : `${baseUrl}?fmt=json3`)
      : baseUrl;
    const res = await fetch(captionUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return "";
    return res.text();
  };

  let body = await fetchCaption(true);
  if (!body) return null;

  const trimmed = body.trim();

  // JSON3 format
  if (trimmed.startsWith("{")) {
    try {
      const json = JSON.parse(body) as {
        events?: Array<{ tStartMs?: number; segs?: Array<{ utf8?: string }> }>;
      };
      const rawEvents = json.events ?? [];
      const segments: TranscriptSegment[] = [];
      for (const ev of rawEvents) {
        if (!ev.segs?.length) continue;
        const text = ev.segs
          .map((s) => (typeof s.utf8 === "string" ? s.utf8 : ""))
          .join("")
          .trim();
        if (text) segments.push({ startMs: ev.tStartMs ?? 0, text });
      }
      if (segments.length > 0) {
        const fullText = segments
          .map((s) => s.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (fullText.length >= MIN_YOUTUBE_TRANSCRIPT_LENGTH)
          return { text: fullText, segments };
      }
    } catch {
      // fall through to XML
    }
    const xmlBody = await fetchCaption(false);
    if (xmlBody) body = xmlBody;
  }

  // XML timedtext format
  const trimmedForXml = body.trim();
  if (
    trimmedForXml.includes("<timedtext") ||
    trimmedForXml.includes("<?xml") ||
    trimmedForXml.includes("<body") ||
    trimmedForXml.includes("<p ") ||
    trimmedForXml.includes("<text ")
  ) {
    const segments: TranscriptSegment[] = [];
    const pWithTimeFormat3 =
      /<p[^>]*\st="(\d+(?:\.\d+)?)"[^>]*\sd="(\d+(?:\.\d+)?)"[^>]*>([\s\S]*?)<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = pWithTimeFormat3.exec(body)) !== null) {
      const startMs = Math.round(parseFloat(m[1] ?? "0"));
      const inner = (m[3] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const text = decodeXmlText(inner);
      if (text) segments.push({ startMs, text });
    }
    if (segments.length === 0) {
      const pWithTime =
        /<p[^>]*\st="(\d+(?:\.\d+)?)"[^>]*\sd="(\d+(?:\.\d+)?)"[^>]*>([^<]*)<\/p>/g;
      while ((m = pWithTime.exec(body)) !== null) {
        const startMs = Math.round(parseFloat(m[1] ?? "0"));
        const text = decodeXmlText(m[3] ?? "");
        if (text) segments.push({ startMs, text });
      }
    }
    if (segments.length === 0) {
      const textWithTime =
        /<text[^>]*start="([^"]*)"[^>]*dur="([^"]*)"[^>]*>([^<]*)<\/text>/g;
      while ((m = textWithTime.exec(body)) !== null) {
        const rawStart = m[1] ?? "0";
        const val = parseFloat(rawStart);
        const startMs = rawStart.includes(".") ? Math.round(val * 1000) : Math.round(val);
        const text = decodeXmlText(m[3] ?? "");
        if (text) segments.push({ startMs, text });
      }
    }
    if (segments.length > 0) {
      const text = segments
        .map((s) => s.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text.length >= MIN_YOUTUBE_TRANSCRIPT_LENGTH) return { text, segments };
    }
    const stripped = body
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const decoded = decodeXmlText(stripped);
    if (decoded.length >= MIN_YOUTUBE_TRANSCRIPT_LENGTH) {
      return { text: decoded, segments: [{ startMs: 0, text: decoded }] };
    }
  }
  return null;
}

export const youtubeTranscriptService = {
  /**
   * Get transcript text and segments for a YouTube URL or video ID.
   * Tries youtube-transcript package first; falls back to direct InnerTube fetch.
   */
  async getTranscript(urlOrId: string): Promise<TranscriptResult> {
    const videoId = this.getVideoId(urlOrId);
    if (!videoId) {
      throw new Error(
        "Invalid YouTube URL. Use format: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID"
      );
    }

    let result = await fetchTranscriptViaPackage(videoId);
    if (!result?.text || result.text.length < MIN_YOUTUBE_TRANSCRIPT_LENGTH) {
      result = await fetchTranscriptDirect(videoId);
    }
    if (!result?.text || result.text.length < MIN_YOUTUBE_TRANSCRIPT_LENGTH) {
      throw new Error(
        "Could not get transcript for this video, or transcript is too short. Try a video with captions enabled (or auto-generated captions)."
      );
    }
    return result;
  },

  /**
   * Extract YouTube video ID from URL or ID string.
   */
  getVideoId(urlOrId: string): string | null {
    if (urlOrId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(urlOrId)) return urlOrId;
    const match = urlOrId.match(YOUTUBE_URL_REGEX);
    return match?.[1] ?? null;
  },

  /**
   * Check if a string is a valid YouTube URL.
   */
  isYouTubeUrl(url: string): boolean {
    return YOUTUBE_URL_REGEX.test(url);
  },
};
