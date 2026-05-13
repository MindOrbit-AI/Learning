import { ImageResponse } from "next/og";

export const alt = "MindOrbit Learn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
            maxWidth: 720,
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            MindOrbit Learn
          </div>
          <div style={{ fontSize: 28, color: "#cbd5e1", lineHeight: 1.35 }}>
            Diagnostic-first student learning — mastery maps, missions, and review that targets
            real gaps.
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#9fe871" }}>
            Cognitive Mastery Network
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 280,
            height: 280,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 200,
              borderRadius: 28,
              backgroundColor: "#020617",
              border: "3px solid #334155",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 9999,
                border: "4px solid #a78bfa",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
