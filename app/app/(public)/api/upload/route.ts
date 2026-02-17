import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません。" }, { status: 400 });
    }

    // R2 バケットの取得
    const bucket = process.env.R2 as R2Bucket;
    if (!bucket) {
      return NextResponse.json({ error: "ストレージに接続できません。" }, { status: 500 });
    }

    // ファイル名の生成 (UUID + 拡張子)
    const extension = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const contentType = file.type;

    // R2 に保存
    await bucket.put(fileName, await file.arrayBuffer(), {
      httpMetadata: { contentType },
    });

    // 保存したファイルのパスを返す
    return NextResponse.json({ 
      url: `/api/storage/${fileName}`,
      fileName 
    });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "アップロード中にエラーが発生しました。" }, { status: 500 });
  }
}
