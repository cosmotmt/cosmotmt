import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/app/(admin)/api/auth";

export const runtime = "edge";

/**
 * ファイルの取得 (GET) - Rangeリクエスト対応版
 * 公開実績用のため、認証なしでアクセス可能
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

    const range = request.headers.get("range");
    
    // CORSヘッダーの共通設定
    const commonHeaders = new Headers();
    commonHeaders.set("Access-Control-Allow-Origin", "*");
    commonHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    commonHeaders.set("Access-Control-Allow-Headers", "Range, Content-Type");
    commonHeaders.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");

    if (range) {
      const object = await bucket.head(filename);
      if (!object) return new NextResponse("File not found", { status: 404 });

      const fileSize = object.size;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
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

      const headers = new Headers(commonHeaders);
      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", (end - start + 1).toString());
      headers.set("Content-Type", chunk.httpMetadata?.contentType || "application/octet-stream");
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("ETag", chunk.httpEtag);

      return new NextResponse(chunk.body, {
        status: 206,
        headers,
      });
    } else {
      const object = await bucket.get(filename);
      if (!object || !object.body) {
        return new NextResponse("File not found", { status: 404 });
      }

      const headers = new Headers(commonHeaders);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", object.size.toString());
      headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("ETag", object.httpEtag);

      return new NextResponse(object.body, {
        headers,
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
 * 管理者のみ実行可能
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // セッションチェック
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
