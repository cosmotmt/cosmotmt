import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const bucket = process.env.R2 as R2Bucket;
    if (!bucket) return new NextResponse("Storage not found", { status: 500 });

    const object = await bucket.head(filename);
    if (!object) return new NextResponse("File not found", { status: 404 });

    const fileSize = object.size;
    const rangeHeader = request.headers.get("range");
    
    // MIMEタイプの決定
    let contentType = object.httpMetadata?.contentType || "application/octet-stream";
    if (contentType === "application/octet-stream" || contentType === "audio/mpeg") {
      const ext = filename.split('.').pop()?.toLowerCase();
      if (ext === "wav") contentType = "audio/wav";
      else if (ext === "mp3") contentType = "audio/mpeg";
      else if (ext === "ogg") contentType = "audio/ogg";
      else if (ext === "m4a") contentType = "audio/mp4";
    }

    // 基本ヘッダー
    const headers = new Headers();
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Type", contentType);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
    
    // 重要: 検証のため一時的にキャッシュを無効化し、Varyを設定
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Vary", "Range");

    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (isNaN(start) || start >= fileSize || end >= fileSize || start > end) {
        headers.set("Content-Range", `bytes */${fileSize}`);
        return new NextResponse(null, { status: 416, headers });
      }

      const chunk = await bucket.get(filename, {
        range: { offset: start, length: end - start + 1 },
      });

      if (!chunk || !chunk.body) return new NextResponse("File not found", { status: 404 });

      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      headers.set("Content-Length", (end - start + 1).toString());

      return new NextResponse(chunk.body, { status: 206, headers });
    } else {
      // Rangeがない場合も、サイズを正確に伝えてシーク可能であることを示す
      const fullObject = await bucket.get(filename);
      if (!fullObject || !fullObject.body) return new NextResponse("File not found", { status: 404 });

      headers.set("Content-Length", fileSize.toString());
      return new NextResponse(fullObject.body, { status: 200, headers });
    }
  } catch (err) {
    console.error("Storage GET error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { verifySession } = await import("@/app/(admin)/api/auth");
  if (!(await verifySession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { filename } = await params;
    const bucket = process.env.R2 as R2Bucket;
    if (!bucket) return NextResponse.json({ error: "Storage not found" }, { status: 500 });
    await bucket.delete(filename);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
