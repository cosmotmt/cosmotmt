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
    const rangeHeader = request.headers.get("range") || request.headers.get("Range");
    
    let contentType = object.httpMetadata?.contentType || "application/octet-stream";
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === "wav") contentType = "audio/wav";
    else if (ext === "mp3") contentType = "audio/mpeg";
    else if (ext === "m4a") contentType = "audio/mp4";

    const headers = new Headers();
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Type", contentType);
    headers.set("ETag", object.httpEtag);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");

    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const match = rangeHeader.match(/^bytes=(\d*)-(\d*)$/);
      if (match) {
        let start: number;
        let end: number;

        if (match[1] === "") {
          // bytes=-500 (suffix range)
          const suffix = parseInt(match[2], 10);
          start = fileSize - suffix;
          end = fileSize - 1;
        } else {
          // bytes=100- or bytes=100-200
          start = parseInt(match[1], 10);
          end = match[2] !== "" ? parseInt(match[2], 10) : fileSize - 1;
        }

        if (start < 0) start = 0;
        if (end >= fileSize) end = fileSize - 1;

        if (start >= fileSize || start > end) {
          headers.set("Content-Range", `bytes */${fileSize}`);
          return new NextResponse(null, { status: 416, headers });
        }

        const chunk = await bucket.get(filename, {
          range: { offset: start, length: end - start + 1 },
        });

        if (chunk && "body" in chunk) {
          headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
          headers.set("Content-Length", (end - start + 1).toString());
          return new NextResponse(chunk.body, { status: 206, headers });
        }
      }
    }

    const fullObject = await bucket.get(filename);
    if (!fullObject || !("body" in fullObject)) return new NextResponse("File not found", { status: 404 });

    headers.set("Content-Length", fileSize.toString());
    return new NextResponse(fullObject.body, { status: 200, headers });

  } catch (err) {
    console.error("Storage GET error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function HEAD(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    const bucket = process.env.R2 as R2Bucket;
    const object = await bucket.head(filename);
    if (!object) return new NextResponse(null, { status: 404 });

    const headers = new Headers();
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Type", object.httpMetadata?.contentType || "audio/mpeg");
    headers.set("Content-Length", object.size.toString());
    headers.set("ETag", object.httpEtag);
    headers.set("Access-Control-Allow-Origin", "*");
    return new NextResponse(null, { status: 200, headers });
  } catch {
    return new NextResponse(null, { status: 500 });
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { verifySession } = await import("@/app/(admin)/api/auth");
  if (!(await verifySession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { filename } = await params;
    const bucket = process.env.R2 as R2Bucket;
    await bucket.delete(filename);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
