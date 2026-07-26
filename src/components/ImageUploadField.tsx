"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import type { UploadFolder } from "@/lib/upload/store";

type ImageUploadFieldProps = {
  value?: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label?: string;
  /** Optional: also delete previous /api/uploads URL when replacing/removing */
  onRemoved?: (previousUrl: string) => void;
};

async function compressImage(file: File, maxWidth = 2000, quality = 0.8): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  if (typeof window === "undefined" || typeof document === "undefined") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / Math.max(bitmap.width, 1));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, outputType === "image/jpeg" ? quality : undefined),
    );
    if (!blob) return file;

    const ext = outputType === "image/png" ? ".png" : ".jpg";
    const name = file.name.replace(/\.\w+$/, "") + ext;
    return new File([blob], name, { type: outputType, lastModified: Date.now() });
  } catch {
    return file;
  }
}

function previewNeedsNativeImg(url: string) {
  return (
    url.startsWith("/api/uploads/") ||
    url.startsWith("/api/media/file/") ||
    url.startsWith("data:image/") ||
    url.startsWith("/uploads/")
  );
}

function displayStatus(url?: string) {
  if (!url) return "No file selected";
  if (url.startsWith("/api/uploads/")) return "Uploaded to MongoDB";
  if (url.startsWith("data:image/")) return "Embedded image saved";
  if (url.startsWith("/api/media/file/")) return "Legacy media file";
  if (url.startsWith("/uploads/")) return "Legacy local path (will fall back on site)";
  if (url.length > 64) return `${url.slice(0, 48)}…`;
  return url;
}

export function ImageUploadField({
  value = "",
  onChange,
  folder,
  label = "Image",
  onRemoved,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.set("file", compressed);
      form.set("folder", folder);

      const response = await fetch("/api/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      if (value && value !== data.url && value.startsWith("/api/uploads/")) {
        onRemoved?.(value);
      }
      onChange(String(data.url));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
      if (typeof window !== "undefined") {
        window.alert(message);
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage() {
    if (!value) return;
    if (value.startsWith("/api/uploads/")) onRemoved?.(value);
    onChange("");
  }

  return (
    <div className="rounded-[1.5rem] border border-forest/10 bg-cream/70 p-4 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink/70">{label}</p>
        <span className="rounded-full bg-forest/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-forest">
          Folder: {folder}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-inner">
          {value ? (
            previewNeedsNativeImg(value) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt={label} className="h-full w-full object-cover" />
            ) : (
              <Image src={value} alt={label} fill className="object-cover" sizes="96px" />
            )
          ) : (
            <div className="grid h-full place-items-center text-xs text-ink/40">No image</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-burgundy px-4 py-2 text-sm font-bold text-white transition hover:bg-forest disabled:opacity-60"
            >
              <Upload className="h-4 w-4" />
              {busy ? "Uploading..." : value ? "Replace Image" : "Upload Image"}
            </button>
            {value ? (
              <button
                type="button"
                disabled={busy}
                onClick={removeImage}
                className="inline-flex items-center gap-2 rounded-full border border-burgundy px-4 py-2 text-sm font-bold text-burgundy transition hover:bg-burgundy hover:text-white disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-ink/50">{displayStatus(value)}</p>
          {error ? <p className="mt-1 text-xs text-burgundy">{error}</p> : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => uploadFile(event.target.files?.[0])}
      />
    </div>
  );
}
