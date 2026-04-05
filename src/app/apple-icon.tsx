import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 80,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -4,
          }}
        >
          NX
        </span>
      </div>
    ),
    { ...size }
  );
}
