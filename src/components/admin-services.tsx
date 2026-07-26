"use client";

import Image from "next/image";
import { FormEvent, useRef, useState, type ReactNode } from "react";
import { Save, Trash2, Upload } from "lucide-react";
import type { ImageAsset, Service } from "@/lib/site";
import { AdminShell } from "@/components/admin";

type EditableService = Service & Record<string, unknown>;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function serviceKey(service: EditableService, index = 0) {
  return String(service.slug ?? `service-${index}`);
}

function blankImage(serviceSlug: string, label: string): ImageAsset {
  return {
    id: `${serviceSlug}-${label.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
    title: label,
    alt: label,
    url: "",
    page: "services",
    status: "published",
  };
}

const HERO_LABELS = ["Hero Background", "Hero Card 1", "Hero Card 2", "Hero Card 3"];

function ensureFourServiceImages(service: EditableService): EditableService {
  const existing = [...(service.images ?? [])];
  while (existing.length < 4) {
    existing.push({
      id: `${service.slug}-hero-${existing.length + 1}`,
      title: HERO_LABELS[existing.length] ?? `Hero ${existing.length + 1}`,
      alt: HERO_LABELS[existing.length] ?? `Hero ${existing.length + 1}`,
      url: "",
      page: "services",
      status: "published",
    });
  }
  return { ...service, images: existing.slice(0, 4) };
}

async function uploadImageFile(file: File, serviceSlug: string, title: string) {
  const form = new FormData();
  form.set("file", file);
  form.set("title", title || file.name);
  form.set("alt", title || file.name);
  form.set("page", "services");
  form.set("tags", `services,${serviceSlug}`);

  const response = await fetch("/api/media", { method: "POST", body: form });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Upload failed.");
  return data.asset as ImageAsset;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  wide?: boolean;
}) {
  const className = "mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none ring-forest/20 focus:ring-4";
  return (
    <label className={cx("block text-sm font-bold text-ink/70", wide && "md:col-span-2")}>
      {label}
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className={className} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={className} />
      )}
    </label>
  );
}

function ListField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  help?: string;
}) {
  return (
    <label className="block text-sm font-bold text-ink/70 md:col-span-2">
      {label}
      {help ? <span className="ml-2 font-normal text-ink/45">{help}</span> : null}
      <textarea
        value={value.join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split(/\r?\n/)
              .map((line) => line.trim())
              .filter(Boolean),
          )
        }
        rows={5}
        className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none ring-forest/20 focus:ring-4"
      />
    </label>
  );
}

function ImageSlot({
  label,
  image,
  serviceSlug,
  onChange,
}: {
  label: string;
  image?: ImageAsset | null;
  serviceSlug: string;
  onChange: (image: ImageAsset) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const asset = await uploadImageFile(file, serviceSlug, image?.title || label);
      onChange({
        ...asset,
        title: image?.title || label,
        alt: image?.alt || label,
        page: "services",
        caption: image?.caption ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-forest/10 bg-cream/70 p-4 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-ink/70">{label}</p>
        <span className="rounded-full bg-forest/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-forest">
          Folder: Services
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-inner">
          {image?.url ? (
            image.url.startsWith("data:image/") || image.url.startsWith("/api/media/file/") || image.url.startsWith("/uploads/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image.url} alt={image.alt || label} className="h-full w-full object-cover" />
            ) : (
              <Image src={image.url} alt={image.alt || label} fill className="object-cover" sizes="96px" />
            )
          ) : (
            <div className="grid h-full place-items-center text-xs text-ink/40">No image</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-burgundy px-4 py-2 text-sm font-bold text-white transition hover:bg-forest disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {busy ? "Uploading..." : image?.url ? "Replace Image" : "Upload Image"}
          </button>
          <p className="mt-2 text-xs text-ink/50">
            {!image?.url
              ? "No file selected"
              : image.url.startsWith("data:image/")
                ? "Embedded image saved"
                : image.url.startsWith("/api/media/file/")
                  ? "Saved media file"
                  : image.url.length > 80
                    ? `${image.url.slice(0, 64)}…`
                    : image.url}
          </p>
          {error ? <p className="mt-1 text-xs text-burgundy">{error}</p> : null}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => onFile(event.target.files?.[0])} />
      {image?.url ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Image Title" value={image.title ?? ""} onChange={(title) => onChange({ ...image, title })} />
          <Field label="Alt Text" value={image.alt ?? ""} onChange={(alt) => onChange({ ...image, alt })} />
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-forest/10 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-3xl text-forest">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function ServicesManager({ initialItems }: { initialItems: unknown[] }) {
  const [items, setItems] = useState<EditableService[]>(() =>
    (initialItems as EditableService[]).map((item) => ensureFourServiceImages(item)),
  );
  const [selectedKey, setSelectedKey] = useState(() => serviceKey((initialItems[0] ?? { slug: "service" }) as EditableService, 0));
  const [status, setStatus] = useState("");
  const selectedIndex = items.findIndex((item, index) => serviceKey(item, index) === selectedKey);
  const service = selectedIndex >= 0 ? items[selectedIndex] : items[0];

  function updateService(mutator: (current: EditableService) => EditableService) {
    if (!service) return;
    setItems((current) => {
      const index = current.findIndex((item, itemIndex) => serviceKey(item, itemIndex) === selectedKey);
      if (index < 0) return current;
      const next = [...current];
      next[index] = mutator(structuredClone(current[index]));
      return next;
    });
  }

  function setServiceImage(imageIndex: number, image: ImageAsset) {
    if (!service) return;
    const images = [...(service.images ?? [])];
    while (images.length <= imageIndex) images.push(blankImage(service.slug, HERO_LABELS[images.length] ?? `Hero ${images.length + 1}`));
    images[imageIndex] = image;
    const nextService = { ...service, images: images.slice(0, 4) };
    setItems((current) =>
      current.map((item, itemIndex) => (serviceKey(item, itemIndex) === selectedKey ? nextService : item)),
    );
    void persistService(nextService, "Image uploaded and saved to live service page.");
  }

  async function persistService(source: EditableService, okMessage = "Saved. Live service page will show these updates.") {
    setStatus("Saving...");
    const payload: EditableService = {
      ...source,
      images: (source.images ?? []).filter((image) => Boolean(image?.url)).slice(0, 4),
    };
    const response = await fetch("/api/admin/content/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const next = await response.json();
    if (response.ok) {
      setItems((current) =>
        current.map((item) => (item.slug === payload.slug ? ensureFourServiceImages(payload) : item)),
      );
      setStatus(okMessage);
      return true;
    }
    setStatus(next.error ?? "Unable to save.");
    return false;
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!service) return;
    await persistService(service);
  }

  async function deleteService() {
    if (!service?.slug || !window.confirm(`Delete service "${service.name}"?`)) return;
    setStatus("Deleting...");
    const response = await fetch("/api/admin/content/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: service.slug }),
    });
    const next = await response.json();
    if (response.ok) {
      const remaining = items.filter((item) => item.slug !== service.slug);
      setItems(remaining);
      setSelectedKey(serviceKey(remaining[0] ?? { slug: "service" }, 0));
      setStatus("Deleted.");
    } else {
      setStatus(next.error ?? "Unable to delete.");
    }
  }

  if (!service) {
    return (
      <AdminShell>
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">No services found.</div>
      </AdminShell>
    );
  }

  const heroImages = service.images ?? [];

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Services CMS</p>
        <h1 className="mt-3 font-serif text-5xl text-forest">Edit service content and hero images.</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-ink/60">
          Each service hero has 1 background + 3 cards. Replace images and save to update the live service page.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="max-h-[48rem] overflow-auto rounded-[2rem] bg-white p-3 shadow-xl shadow-black/5">
          {items.map((item, index) => {
            const key = serviceKey(item, index);
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedKey(key);
                  setStatus("");
                }}
                className={cx(
                  "mb-2 block w-full rounded-2xl px-4 py-3 text-left text-sm",
                  selectedKey === key ? "bg-forest text-white" : "bg-cream hover:bg-sage",
                )}
              >
                <span className="block font-bold">{item.name || item.slug}</span>
                <span className={cx("text-xs", selectedKey === key ? "text-white/70" : "text-ink/45")}>/{item.slug}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={save} className="space-y-5">
          <SectionCard title="Service details">
            <Field label="Service Name" value={service.name ?? ""} onChange={(name) => updateService((current) => ({ ...current, name }))} />
            <Field label="URL Slug" value={service.slug ?? ""} onChange={(slug) => updateService((current) => ({ ...current, slug }))} />
            <label className="block text-sm font-bold text-ink/70">
              Status
              <select
                value={service.status ?? "published"}
                onChange={(event) => updateService((current) => ({ ...current, status: event.target.value as Service["status"] }))}
                className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm"
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="coming-soon">coming-soon</option>
              </select>
            </label>
            <Field label="Eyebrow" value={service.eyebrow ?? ""} onChange={(eyebrow) => updateService((current) => ({ ...current, eyebrow }))} />
            <Field label="Price Label" value={service.priceLabel ?? ""} onChange={(priceLabel) => updateService((current) => ({ ...current, priceLabel }))} />
            <Field label="Duration" value={service.duration ?? ""} onChange={(duration) => updateService((current) => ({ ...current, duration }))} />
            <Field label="Card Summary" value={service.summary ?? ""} onChange={(summary) => updateService((current) => ({ ...current, summary }))} multiline wide />
            <Field label="Full Description" value={service.description ?? ""} onChange={(description) => updateService((current) => ({ ...current, description }))} multiline wide />
            <Field label="Who It Is For" value={service.forWhom ?? ""} onChange={(forWhom) => updateService((current) => ({ ...current, forWhom }))} multiline wide />
            <ListField label="Benefits" value={service.benefits ?? []} onChange={(benefits) => updateService((current) => ({ ...current, benefits }))} help="One benefit per line." />
            <ListField label="What Is Included" value={service.includes ?? []} onChange={(includes) => updateService((current) => ({ ...current, includes }))} help="One item per line." />
            <ListField label="Service Process" value={service.process ?? []} onChange={(process) => updateService((current) => ({ ...current, process }))} help="One step per line." />
            <ListField label="Related Service Slugs" value={service.related ?? []} onChange={(related) => updateService((current) => ({ ...current, related }))} help="One service slug per line." />
          </SectionCard>

          <SectionCard title="Hero images">
            {HERO_LABELS.map((label, index) => (
              <ImageSlot
                key={`${service.slug}-hero-${index}`}
                label={label}
                image={heroImages[index]}
                serviceSlug={service.slug}
                onChange={(image) => setServiceImage(index, image)}
              />
            ))}
          </SectionCard>

          <div className="flex flex-wrap items-center gap-4 rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5">
            <button className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
              <Save className="h-4 w-4" /> Save Service
            </button>
            <button
              type="button"
              onClick={deleteService}
              className="inline-flex items-center gap-2 rounded-full border border-burgundy px-5 py-3 font-bold text-burgundy transition hover:bg-burgundy hover:text-white"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            {status ? <p className="text-sm text-burgundy">{status}</p> : null}
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
