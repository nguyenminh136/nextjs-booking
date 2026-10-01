import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IMAGE_HOSTS = new Set([
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
  "images.unsplash.com"
]);
const ALLOWED_CONTENT_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp"
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(req: NextRequest) {
  const source = req.nextUrl.searchParams.get("url");
  if (!source) return errorResponse("Image URL is required", 400);

  let imageUrl: URL;
  try {
    imageUrl = new URL(source);
  } catch {
    return errorResponse("Invalid image URL", 400);
  }

  if (
    imageUrl.protocol !== "https:" ||
    imageUrl.username ||
    imageUrl.password ||
    imageUrl.port ||
    !ALLOWED_IMAGE_HOSTS.has(imageUrl.hostname)
  ) {
    return errorResponse("Image URL is not allowed", 400);
  }

  try {
    const response = await fetch(imageUrl, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok || response.status >= 300) {
      return errorResponse("Image source is unavailable", 502);
    }

    const contentType = response.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase();
    if (!contentType || !ALLOWED_CONTENT_TYPES.has(contentType)) {
      return errorResponse("Image source returned an unsupported content type", 415);
    }

    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
      await response.body?.cancel();
      return errorResponse("Image exceeds the maximum allowed size", 413);
    }

    if (!response.body) {
      return errorResponse("Image source returned no content", 502);
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_IMAGE_BYTES) {
        await reader.cancel();
        return errorResponse("Image exceeds the maximum allowed size", 413);
      }
      chunks.push(value);
    }

    const body = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return new NextResponse(body, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Length": String(totalBytes),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return errorResponse("Unable to retrieve image", 502);
  }
}
