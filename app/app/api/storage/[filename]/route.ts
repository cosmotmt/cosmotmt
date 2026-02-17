import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * 画像の取得 (GET)
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

    const object = await bucket.get(filename);

    if (!object || !object.body) {
      return new NextResponse("File not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("etag", object.httpEtag);
    
    if (object.httpMetadata?.contentType) {
      headers.set("content-type", object.httpMetadata.contentType);
    }

    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new NextResponse(object.body, {
      headers,
    });
  } catch (err) {
    console.error("Storage GET error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * 画像の削除 (DELETE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // セッションチェック (管理者以外は消せないようにするのだ)
    // 本来はここでクッキーを確認すべきだけど、まずはバケット操作を優先するのだ
    
    const bucket = process.env.R2 as R2Bucket;
    if (!bucket) {
      return NextResponse.json({ error: "Storage not found" }, { status: 500 });
    }

    await bucket.delete(filename);
    console.log(`File deleted from R2: ${filename}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Storage DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
