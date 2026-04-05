import { NextRequest, NextResponse } from "next/server";

const FINANCELIB_API = process.env.FINANCELIB_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const filename = req.headers.get("x-filename") || "unknown";
    const body = await req.arrayBuffer();

    // Forward to Python backend
    try {
      const res = await fetch(`${FINANCELIB_API}/api/analyze/upload`, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
          "X-Filename": filename,
        },
        body: Buffer.from(body),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not available, do basic parsing
    }

    // Fallback: basic file info
    const ext = filename.split(".").pop()?.toLowerCase();
    return NextResponse.json({
      status: "analyzed",
      type: ext === "pdf" ? "pdf" : "excel",
      size: body.byteLength,
      filename,
      message: `${filename} dosyası alındı (${(body.byteLength / 1024).toFixed(1)} KB). Python backend bağlantısı ile detaylı analiz yapılabilir.`,
    });
  } catch (error) {
    console.error("File analysis error:", error);
    return NextResponse.json(
      { error: "Dosya işlenemedi" },
      { status: 500 }
    );
  }
}
