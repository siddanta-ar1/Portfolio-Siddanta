import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Siddanta Sodari — Full Stack Developer & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px 88px",
          position: "relative",
        }}
      >
        {/* Top-right: site label */}
        <div
          style={{
            position: "absolute",
            top: 72,
            right: 88,
            fontSize: 18,
            color: "#4b5563",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          siddanta.vercel.app
        </div>

        {/* Subtle horizontal rule */}
        <div
          style={{
            position: "absolute",
            bottom: 148,
            left: 88,
            right: 88,
            height: 1,
            background: "rgba(255,255,255,0.07)",
          }}
        />

        {/* Category chip */}
        <div
          style={{
            fontSize: 14,
            color: "#6b7280",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 28,
            fontFamily: "monospace",
          }}
        >
          Portfolio — Chitwan, Nepal
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ebebeb",
            lineHeight: 1,
            marginBottom: 24,
            letterSpacing: "-0.01em",
          }}
        >
          Siddanta Sodari
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#6b7280",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          Full Stack Developer · Quantum Computing · Community Builder
        </div>
      </div>
    ),
    { ...size },
  );
}
