import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * ファイルの取得 (GET) - Rangeリクエスト対応版
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const bucket = process.env.R2 as R2Bucket;
    if (!bucket) {
      return new NextResponse("Storage not found", { status: 500 });
    }

    const object = await bucket.head(filename);
    if (!object) return new NextResponse("File not found", { status: 404 });

    const fileSize = object.size;
    const rangeHeader = request.headers.get("range") || request.headers.get("Range");
    
    // MIMEタイプの決定
    let contentType = object.httpMetadata?.contentType || "application/octet-stream";
    if (contentType === "application/octet-stream" || contentType === "audio/mpeg") {
      const ext = filename.split('.').pop()?.toLowerCase();
      if (ext === "wav") contentType = "audio/wav";
      else if (ext === "mp3") contentType = "audio/mpeg";
      else if (ext === "ogg") contentType = "audio/ogg";
      else if (ext === "m4a") contentType = "audio/mp4";
    }

    // 共通レスポンスヘッダー
    const commonHeaders = new Headers();
    commonHeaders.set("Access-Control-Allow-Origin", "*");
    commonHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    commonHeaders.set("Access-Control-Allow-Headers", "Range, Content-Type");
    commonHeaders.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
    commonHeaders.set("Accept-Ranges", "bytes");
    commonHeaders.set("Content-Type", contentType);
    commonHeaders.set("ETag", object.httpEtag);
    commonHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    commonHeaders.set("X-Content-Type-Options", "nosniff");

    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (isNaN(start) || start >= fileSize || end >= fileSize || start > end) {
        return new NextResponse("Requested range not satisfiable", {
          status: 416,
          headers: {
            ...Object.fromEntries(commonHeaders.entries()),
            "Content-Range": `bytes */${fileSize}`
          },
        });
      }

      const chunk = await bucket.get(filename, {
        range: { offset: start, length: end - start + 1 },
      });

      if (!chunk || !chunk.body) {
        return new NextResponse("File not found", { status: 404 });
      }

      const responseHeaders = new Headers(commonHeaders);
      responseHeaders.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      responseHeaders.set("Content-Length", (end - start + 1).toString());

      return new NextResponse(chunk.body, {
        status: 206,
        headers: responseHeaders,
      });
    } else {
      // Range指定がない場合（初回読み込み）
      const fullObject = await bucket.get(filename);
      if (!fullObject || !fullObject.body) {
        return new NextResponse("File not found", { status: 404 });
      }

      const responseHeaders = new Headers(commonHeaders);
      responseHeaders.set("Content-Length", fileSize.toString());

      return new NextResponse(fullObject.body, {
        status: 200,
        headers: responseHeaders,
      });
    }
  } catch (err) {
    console.error("Storage GET error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * OPTIONSリクエスト (CORSプリフライト用)
 */
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

/**
 * ファイルの削除 (DELETE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { verifySession } = await import("@/app/(admin)/api/auth");
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await params;
    const bucket = process.env.R2 as R2Bucket;
    if (!bucket) {
      return NextResponse.json({ error: "Storage not found" }, { status: 500 });
    }

    await bucket.delete(filename);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Storage DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
