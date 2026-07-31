/** Browser-only helpers to prepare admin uploads (always PNG, under Vercel body limit). */

/** Stay under Vercel serverless body limit (~4.5MB) with multipart overhead. */
export const MAX_UPLOAD_TARGET_BYTES = 3 * 1024 * 1024;

async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not convert image to PNG.");
  return blob;
}

async function renderToPng(file: File, maxEdge: number): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height, 1));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable for image compression.");
    // White background so transparent sources don't look wrong on cream UI.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await canvasToPngBlob(canvas);
    const base = file.name.replace(/\.[^.]+$/, "") || "upload";
    return new File([blob], `${base}.png`, { type: "image/png", lastModified: Date.now() });
  } finally {
    bitmap.close();
  }
}

/**
 * Convert any raster image to PNG and shrink until it fits the upload limit.
 * JPG / WebP / GIF / PNG all become `.png`.
 */
export async function prepareUploadPng(file: File): Promise<File> {
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name)) {
    throw new Error("Please choose an image file (JPG, PNG, WebP, or GIF).");
  }

  // Animated GIF: keep as-is only if already small PNG; otherwise rasterize first frame.
  const edges = [1600, 1400, 1200, 1000, 800, 640, 480];
  let last: File | null = null;

  for (const edge of edges) {
    try {
      last = await renderToPng(file, edge);
      if (last.size <= MAX_UPLOAD_TARGET_BYTES) return last;
    } catch {
      // try next size
    }
  }

  if (last && last.size <= MAX_UPLOAD_TARGET_BYTES) return last;
  if (last) {
    throw new Error(
      `Image is still too large after compression (${(last.size / 1024 / 1024).toFixed(1)}MB). Use a smaller photo (under ~3MB).`,
    );
  }
  throw new Error("Could not prepare image for upload. Try another file.");
}

/** Parse upload API body safely (avoids "Unexpected token R" on 413 HTML pages). */
export async function readUploadResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  try {
    return text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    if (response.status === 413 || /request entity too large/i.test(text)) {
      throw new Error("Image is too large for the server (max ~4MB). Compress or use a smaller photo.");
    }
    throw new Error(
      response.ok
        ? "Upload returned an unexpected response."
        : `Upload failed (${response.status}). Try a smaller PNG under 3MB.`,
    );
  }
}
