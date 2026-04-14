import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MindOrbit Learn — Cognitive Mastery Network";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#1e293b",
              border: "2px solid #6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                border: "3px solid #a78bfa",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            MindOrbit Learn
          </span>
        </div>
        <p
          style={{
            fontSize: 32,
            color: "#cbd5e1",
            maxWidth: 900,
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          Diagnostic-first learning — map mastery, run missions, compound what sticks.
        </p>
      </div>
    ),
    {
      ...size,
    },
  );
}
