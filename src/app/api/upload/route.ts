import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  isUploadFolder,
  saveFolderUpload,
  type UploadFolder,
} from "@/lib/upload/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") ?? "misc").trim().toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }
    if (!isUploadFolder(folderRaw)) {
      return NextResponse.json(
        { error: 'Invalid folder. Use "pages", "products", "gallery", or "misc".' },
        { status: 400 },
      );
    }

    const saved = await saveFolderUpload(file, folderRaw as UploadFolder);
    return NextResponse.json({
      success: true,
      url: saved.url,
      filename: saved.filename,
      folder: saved.folder,
      size: saved.size,
      mimeType: saved.mimeType,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed.";
    // Always JSON so the admin UI never hits "Unexpected token R..."
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
