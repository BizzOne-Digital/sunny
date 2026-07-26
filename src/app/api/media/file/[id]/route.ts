import { NextResponse } from "next/server";
import { getMediaFileBytes } from "@/lib/media-file";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: rawId } = await context.params;
    const id = decodeURIComponent(rawId || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Missing file id." }, { status: 400 });
    }

    const file = await getMediaFileBytes(id);
    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(file.bytes), {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
        "Content-Length": String(file.bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${file.filename.replace(/"/g, "")}"`,
      },
    });
  } catch (error) {
    console.error("Media file serve error:", error);
    return NextResponse.json({ error: "Unable to load media file." }, { status: 500 });
  }
}
