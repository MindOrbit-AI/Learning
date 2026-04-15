import { ImageResponse } from "next/og";
import { getSnapshotByShareToken } from "@/services/mastery-share-service";

export const runtime = "nodejs";

export const alt = "Mastery snapshot";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getSnapshotByShareToken(token);
  const s = data?.snapshot;

  const title = s ? `${s.displayName}'s mastery` : "MindOrbit Learn";
  const line2 = s
    ? `Lv ${s.level + 1} · ${s.xp.toLocaleString()} XP · ${s.missionsCompleted} missions · ${s.streakCount}d streak`
    : "Cognitive mastery network";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #312e81 55%, #4c1d95 100%)",
          padding: 64,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#f8fafc",
            marginBottom: 20,
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#cbd5e1",
            maxWidth: 1000,
            lineHeight: 1.4,
          }}
        >
          {line2}
        </div>
        {s != null && (
          <div
            style={{
              marginTop: 32,
              fontSize: 24,
              color: "#a78bfa",
            }}
          >
            {s.nodesMastered} concepts mastered
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
