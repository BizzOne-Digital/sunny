import { NextResponse } from "next/server";
import {
  getFolderUpload,
  isSafeUploadFilename,
  isUploadFolder,
  toUploadBuffer,
  type UploadFolder,
} from "@/lib/upload/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ folder: string; filename: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { folder: rawFolder, filename: rawFilename } = await context.params;
    const folder = decodeURIComponent(rawFolder || "").trim();
    const filename = decodeURIComponent(rawFilename || "").trim();

    if (!isUploadFolder(folder) || !isSafeUploadFilename(filename)) {
      return NextResponse.json({ error: "Invalid upload path." }, { status: 400 });
    }

    const file = await getFolderUpload(folder as UploadFolder, filename);
    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const bytes = toUploadBuffer(file.data);
    if (!bytes?.length) {
      return NextResponse.json({ error: "File data missing." }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": file.mimeType || "application/octet-stream",
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${filename.replace(/"/g, "")}"`,
      },
    });
  } catch (error) {
    console.error("Serve upload error:", error);
    return NextResponse.json({ error: "Unable to load upload." }, { status: 500 });
  }
}
