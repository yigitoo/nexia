import { ImageResponse } from "next/og";

export const alt = "Nexia - AI-Powered Financial Terminal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 18,
            background: "linear-gradient(135deg, #059669, #34d399)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <span style={{ color: "white", fontSize: 42, fontWeight: 800, letterSpacing: -2 }}>
            NX
          </span>
        </div>

        <span style={{ color: "white", fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>
          Nexia
        </span>

        <span style={{ color: "#a7f3d0", fontSize: 26, fontWeight: 400, marginTop: 10 }}>
          AI-Powered Financial Terminal
        </span>

        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          {["BIST Analiz", "Kaos Teorisi", "Stokastik Süreçler", "Risk Yönetimi"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                border: "1px solid rgba(167,243,208,0.25)",
                color: "#a7f3d0",
                fontSize: 17,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <span style={{ color: "rgba(167,243,208,0.35)", fontSize: 15, marginTop: 44 }}>
          IGNITE 26 · Koç Üniversitesi KUEC · Paribu Hub
        </span>
      </div>
    ),
    { ...size }
  );
}
