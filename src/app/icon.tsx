import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -1,
          }}
        >
          NX
        </span>
      </div>
    ),
    { ...size }
  );
}
