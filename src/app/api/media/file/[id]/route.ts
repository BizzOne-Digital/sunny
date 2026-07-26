import { NextResponse } from "next/server";
import { getMediaFile } from "@/lib/media-file";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing file id." }, { status: 400 });
  }

  const file = await getMediaFile(id);
  if (!file?.data) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const bytes = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data as ArrayBuffer);

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
