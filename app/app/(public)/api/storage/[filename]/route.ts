import { NextRequest, NextResponse } from "next/server";

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

    const object = await bucket.head(filename);
    if (!object) return new NextResponse("File not found", { status: 404 });

    const fileSize = object.size;
    const range = request.headers.get("range");
    
    // MIMEタイプの決定 (ブラウザのシーク安定性に直結)
    let contentType = object.httpMetadata?.contentType || "application/octet-stream";
    if (contentType === "application/octet-stream" || contentType === "audio/mpeg") {
      const ext = filename.split('.').pop()?.toLowerCase();
      if (ext === "wav") contentType = "audio/wav";
      else if (ext === "mp3") contentType = "audio/mpeg";
      else if (ext === "ogg") contentType = "audio/ogg";
      else if (ext === "m4a") contentType = "audio/mp4";
    }

    // 共通ヘッダーの設定
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Range, Content-Type");
    headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
    headers.set("Accept-Ranges", "bytes"); // これが重要
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("ETag", object.httpEtag);

    if (range && range.startsWith("bytes=")) {
      const parts = range.replace(/bytes=/, "").split("-");
      const startStr = parts[0];
      const endStr = parts[1];

      let start = startStr ? parseInt(startStr, 10) : NaN;
      let end = endStr ? parseInt(endStr, 10) : NaN;

      if (isNaN(start) && !isNaN(end)) {
        start = fileSize - end;
        end = fileSize - 1;
      } else if (!isNaN(start) && isNaN(end)) {
        end = fileSize - 1;
      }

      if (isNaN(start) || start >= fileSize || (end !== undefined && end >= fileSize) || start > end) {
        headers.set("Content-Range", `bytes */${fileSize}`);
        return new NextResponse("Requested range not satisfiable", {
          status: 416,
          headers,
        });
      }

      const chunk = await bucket.get(filename, {
        range: { offset: start, length: end - start + 1 },
      });

      if (!chunk || !chunk.body) {
        return new NextResponse("File not found", { status: 404 });
      }

      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      headers.set("Content-Length", (end - start + 1).toString());

      return new NextResponse(chunk.body, {
        status: 206,
        headers,
      });
    } else {
      const fullObject = await bucket.get(filename);
      if (!fullObject || !fullObject.body) {
        return new NextResponse("File not found", { status: 404 });
      }

      headers.set("Content-Length", fileSize.toString());

      return new NextResponse(fullObject.body, {
        status: 200,
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
  // 動的インポートを使用してGET時のフットプリントを減らす
  const { verifySession } = await import("@/app/(admin)/api/auth");
  
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
