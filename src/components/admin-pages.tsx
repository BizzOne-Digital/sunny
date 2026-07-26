"use client";

import Image from "next/image";
import { FormEvent, useRef, useState, type ReactNode } from "react";
import { Save, Trash2, Upload } from "lucide-react";
import type { ImageAsset, PageBlock, PageContent } from "@/lib/site";
import { AdminShell } from "@/components/admin";

type EditablePage = PageContent & Record<string, unknown>;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function pageKey(page: EditablePage, index = 0) {
  return String(page.slug ?? `page-${index}`);
}

function blankImage(pageSlug: string, label: string): ImageAsset {
  return {
    id: `${pageSlug}-${label}-${Date.now()}`,
    title: label,
    alt: label,
    url: "",
    page: pageSlug,
    status: "published",
  };
}

function homeGalleryDefaults(): ImageAsset[] {
  return Array.from({ length: 10 }, (_, index) => {
    const n = String(index + 1).padStart(2, "0");
    return {
      id: `home-gallery-${n}`,
      title: `Home gallery image ${index + 1}`,
      alt: `DTdogs home gallery image ${index + 1}`,
      url: `/images/home/home-gallery-${n}.webp`,
      width: 1200,
      height: 1500,
      page: "home",
      order: index + 1,
      status: "published" as const,
    };
  });
}

function homeFeaturesDefaults(): ImageAsset[] {
  return [
    {
      id: "home-why-a",
      title: "Calm care",
      alt: "Dog resting comfortably in care environment",
      url: "/images/home/home-why-a.png",
      width: 600,
      height: 400,
      page: "home",
      status: "published",
    },
    {
      id: "home-why-b",
      title: "Safe play",
      alt: "Dog enjoying safe outdoor activity",
      url: "/images/home/home-why-b.png",
      width: 600,
      height: 400,
      page: "home",
      status: "published",
    },
    {
      id: "home-story",
      title: "Care connection",
      alt: "Caregiver sharing a calm outdoor moment with a dog",
      url: "/images/home/home-story.png",
      width: 600,
      height: 400,
      page: "home",
      status: "published",
    },
  ];
}

function galleryHeroDefaults(): ImageAsset[] {
  return [
    {
      id: "gallery-generated-hero",
      title: "Gallery hero background",
      alt: "Well-groomed dog enjoying a golden-hour Toronto courtyard walk",
      url: "/images/gallery/gallery-hero.png",
      width: 1800,
      height: 1200,
      page: "gallery",
      status: "published",
    },
    {
      id: "gallery-hero-1",
      title: "Courtyard dog walk",
      alt: "Small happy dog walking calmly through a clean modern outdoor courtyard",
      url: "/images/gallery/gallery-1.png",
      width: 1400,
      height: 1000,
      page: "gallery",
      status: "published",
    },
    {
      id: "gallery-hero-2",
      title: "Autumn leash walk",
      alt: "Dog walking safely on leash through a warm autumn park trail",
      url: "/images/gallery/gallery-2.png",
      width: 1400,
      height: 1000,
      page: "gallery",
      status: "published",
    },
    {
      id: "gallery-hero-3",
      title: "Indoor care moment",
      alt: "Dogs calmly gathered in a cozy modern indoor care lounge",
      url: "/images/gallery/gallery-3.png",
      width: 1400,
      height: 1000,
      page: "gallery",
      status: "published",
    },
  ];
}

const HERO_BACKGROUND_ONLY_SLUGS = new Set(["home", "booking", "testimonials", "faq", "blog", "team", "pricing", "policy", "gift-cards"]);

function heroSlotCount(slug: string) {
  return HERO_BACKGROUND_ONLY_SLUGS.has(slug) ? 1 : 4;
}

function heroSlotLabels(slug: string) {
  return HERO_BACKGROUND_ONLY_SLUGS.has(slug)
    ? ["Hero Background"]
    : ["Hero Background", "Hero Card 1", "Hero Card 2", "Hero Card 3"];
}

function ensureFourHeroImages(page: EditablePage): EditablePage {
  const slots = heroSlotCount(page.slug);
  const existing = [...(page.hero?.images ?? [])];
  const filled = existing.filter((image) => Boolean(image?.url));

  // Prefer known gallery defaults when this is the gallery page and slots are incomplete.
  if (page.slug === "gallery") {
    const defaults = galleryHeroDefaults();
    const heroImages =
      filled.length >= 4 ? filled.slice(0, 4) : [...filled, ...defaults.slice(filled.length)].slice(0, 4);
    return { ...page, hero: { ...page.hero, images: heroImages } };
  }

  while (existing.length < slots) {
    existing.push({
      id: `${page.slug}-hero-${existing.length + 1}`,
      title: existing.length === 0 ? "Hero Background" : `Hero Card ${existing.length}`,
      alt: existing.length === 0 ? "Hero background" : `Hero card ${existing.length}`,
      url: "",
      page: page.slug,
      status: "published",
    });
  }

  return {
    ...page,
    hero: {
      ...page.hero,
      images: existing.slice(0, slots),
    },
  };
}

function normalizePages(items: EditablePage[]): EditablePage[] {
  return items.map((page) => {
    let next = ensureFourHeroImages(page);

    if (next.slug !== "home") return next;

    const blocks = [...(next.blocks ?? [])];

    const galleryIndex = blocks.findIndex((block) => block.type === "gallery");
    if (galleryIndex >= 0) {
      const gallery = { ...blocks[galleryIndex] };
      const existing = (gallery.images ?? []).filter((image) => Boolean(image?.url));
      const defaults = homeGalleryDefaults();
      // Keep CMS uploads (Cloudinary /api/media/file /uploads). Only pad missing slots.
      gallery.images =
        existing.length >= 10
          ? existing.slice(0, 10)
          : existing.length > 0
            ? [...existing, ...defaults.slice(existing.length)].slice(0, 10)
            : defaults;
      blocks[galleryIndex] = gallery;
    }

    const featuresIndex = blocks.findIndex((block) => block.type === "features");
    if (featuresIndex >= 0) {
      const features = { ...blocks[featuresIndex] };
      const existing = (features.images ?? []).filter((image) => Boolean(image?.url));
      const defaults = homeFeaturesDefaults();
      features.images =
        existing.length >= 3
          ? existing.slice(0, 3)
          : [...existing, ...defaults.slice(existing.length)].slice(0, 3);
      blocks[featuresIndex] = features;
    }

    return { ...next, blocks };
  });
}

function sectionImageLimit(blockType: string, pageSlug?: string) {
  if (pageSlug === "home" && blockType === "gallery") return 10;
  if (pageSlug === "home" && blockType === "features") return 3;
  return blockType === "gallery" ? 12 : 8;
}

async function uploadImageFile(file: File, pageSlug: string, title: string) {
  const form = new FormData();
  form.set("file", file);
  form.set("title", title || file.name);
  form.set("alt", title || file.name);
  form.set("page", pageSlug);
  form.set("tags", "pages");

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

function ImageSlot({
  label,
  image,
  pageSlug,
  folder = "pages",
  onChange,
}: {
  label: string;
  image?: ImageAsset | null;
  pageSlug: string;
  folder?: string;
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
      const asset = await uploadImageFile(file, pageSlug, image?.title || label);
      onChange({
        ...asset,
        title: image?.title || label,
        alt: image?.alt || label,
        page: pageSlug,
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
          Folder: {folder}
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
          <p className="mt-2 break-all text-xs text-ink/50">{image?.url || "No file selected"}</p>
          {error ? <p className="mt-1 text-xs text-burgundy">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
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

export function PagesManager({ initialItems }: { initialItems: unknown[] }) {
  const [items, setItems] = useState<EditablePage[]>(() => normalizePages(initialItems as EditablePage[]));
  const [selectedKey, setSelectedKey] = useState(() => pageKey((initialItems[0] ?? { slug: "page" }) as EditablePage, 0));
  const [status, setStatus] = useState("");
  const selectedIndex = items.findIndex((item, index) => pageKey(item, index) === selectedKey);
  const page = selectedIndex >= 0 ? items[selectedIndex] : items[0];

  function updatePage(mutator: (current: EditablePage) => EditablePage) {
    if (!page) return;
    setItems((current) => {
      const index = current.findIndex((item, itemIndex) => pageKey(item, itemIndex) === selectedKey);
      if (index < 0) return current;
      const next = [...current];
      next[index] = mutator(structuredClone(current[index]));
      return next;
    });
  }

  function updateHero(partial: Partial<PageContent["hero"]>) {
    updatePage((current) => ({
      ...current,
      hero: { ...current.hero, ...partial },
    }));
  }

  function updateBlock(index: number, partial: Partial<PageBlock>) {
    updatePage((current) => {
      const blocks = [...(current.blocks ?? [])];
      blocks[index] = { ...blocks[index], ...partial };
      return { ...current, blocks };
    });
  }

  function buildPayload(source: EditablePage): EditablePage {
    return {
      ...source,
      hero: {
        ...source.hero,
        images: (source.hero?.images ?? []).filter((image) => Boolean(image?.url)),
      },
      blocks: (source.blocks ?? []).map((block) => ({
        ...block,
        images: (block.images ?? []).filter((image) => Boolean(image?.url)),
        items: (block.items ?? []).map((item) =>
          item.image && !item.image.url ? { ...item, image: undefined } : item,
        ),
      })),
    };
  }

  async function persistPage(source: EditablePage, okMessage = "Saved. Live page will show these updates.") {
    setStatus("Saving...");
    const payload = buildPayload(source);
    const response = await fetch("/api/admin/content/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const next = await response.json();
    if (response.ok) {
      setItems((current) => current.map((item) => (item.slug === payload.slug ? { ...ensureFourHeroImages(payload), blocks: payload.blocks } : item)));
      setStatus(okMessage);
      return true;
    }
    setStatus(next.error ?? "Unable to save.");
    return false;
  }

  function setHeroImage(imageIndex: number, image: ImageAsset) {
    if (!page) return;
    const images = [...(page.hero?.images ?? [])];
    while (images.length <= imageIndex) images.push(blankImage(page.slug, `Hero ${images.length + 1}`));
    images[imageIndex] = image;
    const nextPage = { ...page, hero: { ...page.hero, images } };
    setItems((current) =>
      current.map((item, itemIndex) => (pageKey(item, itemIndex) === selectedKey ? nextPage : item)),
    );
    void persistPage(nextPage, "Image uploaded and saved to live page.");
  }

  function setBlockImage(blockIndex: number, imageIndex: number, image: ImageAsset) {
    if (!page) return;
    const blocks = [...(page.blocks ?? [])];
    const block = { ...blocks[blockIndex] };
    const images = [...(block.images ?? [])];
    while (images.length <= imageIndex) images.push(blankImage(page.slug, `Section image ${images.length + 1}`));
    images[imageIndex] = image;
    block.images = images;
    blocks[blockIndex] = block;
    const nextPage = { ...page, blocks };
    setItems((current) =>
      current.map((item, itemIndex) => (pageKey(item, itemIndex) === selectedKey ? nextPage : item)),
    );
    void persistPage(nextPage, "Image uploaded and saved to live page.");
  }

  function setBlockItemImage(blockIndex: number, itemIndex: number, image: ImageAsset) {
    if (!page) return;
    const blocks = [...(page.blocks ?? [])];
    const block = { ...blocks[blockIndex] };
    const itemsList = [...(block.items ?? [])];
    itemsList[itemIndex] = { ...itemsList[itemIndex], image };
    block.items = itemsList;
    blocks[blockIndex] = block;
    const nextPage = { ...page, blocks };
    setItems((current) =>
      current.map((item, itemIndex) => (pageKey(item, itemIndex) === selectedKey ? nextPage : item)),
    );
    void persistPage(nextPage, "Image uploaded and saved to live page.");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!page) return;
    await persistPage(page);
  }

  async function deletePage() {
    if (!page?.slug || !window.confirm(`Delete page "${page.title}"?`)) return;
    setStatus("Deleting...");
    const response = await fetch("/api/admin/content/pages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: page.slug }),
    });
    const next = await response.json();
    if (response.ok) {
      const remaining = items.filter((item) => item.slug !== page.slug);
      setItems(remaining);
      setSelectedKey(pageKey(remaining[0] ?? { slug: "page" }, 0));
      setStatus("Deleted.");
    } else {
      setStatus(next.error ?? "Unable to delete.");
    }
  }

  if (!page) {
    return (
      <AdminShell>
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">No pages found.</div>
      </AdminShell>
    );
  }

  const heroImages = page.hero?.images ?? [];
  const heroSlots = heroSlotCount(page.slug);
  const heroLabels = heroSlotLabels(page.slug);

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Pages CMS</p>
        <h1 className="mt-3 font-serif text-5xl text-forest">Edit page content and images.</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-ink/60">
          Update each section&apos;s text and replace its image. Save to push changes to the live site.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="max-h-[48rem] overflow-auto rounded-[2rem] bg-white p-3 shadow-xl shadow-black/5">
          {items.map((item, index) => {
            const key = pageKey(item, index);
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
                <span className="block font-bold">{item.title || item.slug}</span>
                <span className={cx("text-xs", selectedKey === key ? "text-white/70" : "text-ink/45")}>/{item.slug}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={save} className="space-y-5">
          <SectionCard title="Page settings">
            <Field label="Page Title" value={page.title ?? ""} onChange={(title) => updatePage((current) => ({ ...current, title }))} />
            <Field label="Navigation Title" value={page.navTitle ?? ""} onChange={(navTitle) => updatePage((current) => ({ ...current, navTitle }))} />
            <Field label="URL Slug" value={page.slug ?? ""} onChange={(slug) => updatePage((current) => ({ ...current, slug }))} />
            <label className="block text-sm font-bold text-ink/70">
              Status
              <select
                value={page.status ?? "published"}
                onChange={(event) => updatePage((current) => ({ ...current, status: event.target.value as PageContent["status"] }))}
                className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm"
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </label>
            <Field label="SEO Title" value={page.seoTitle ?? ""} onChange={(seoTitle) => updatePage((current) => ({ ...current, seoTitle }))} wide />
            <Field
              label="Meta Description"
              value={page.metaDescription ?? ""}
              onChange={(metaDescription) => updatePage((current) => ({ ...current, metaDescription }))}
              multiline
              wide
            />
          </SectionCard>

          <SectionCard title="Hero">
            <Field label="Eyebrow" value={page.hero?.eyebrow ?? ""} onChange={(eyebrow) => updateHero({ eyebrow })} />
            <Field label="Title" value={page.hero?.title ?? ""} onChange={(title) => updateHero({ title })} wide />
            <Field label="Body" value={page.hero?.body ?? ""} onChange={(body) => updateHero({ body })} multiline wide />
            <Field
              label="Primary CTA"
              value={page.hero?.primaryCta?.label ?? ""}
              onChange={(label) => updateHero({ primaryCta: { label, href: page.hero?.primaryCta?.href ?? "#" } })}
            />
            <Field
              label="Primary Href"
              value={page.hero?.primaryCta?.href ?? ""}
              onChange={(href) => updateHero({ primaryCta: { label: page.hero?.primaryCta?.label ?? "Learn more", href } })}
            />
            <Field
              label="Secondary CTA"
              value={page.hero?.secondaryCta?.label ?? ""}
              onChange={(label) => updateHero({ secondaryCta: { label, href: page.hero?.secondaryCta?.href ?? "#" } })}
            />
            <Field
              label="Secondary Href"
              value={page.hero?.secondaryCta?.href ?? ""}
              onChange={(href) => updateHero({ secondaryCta: { label: page.hero?.secondaryCta?.label ?? "Explore", href } })}
            />
            {Array.from({ length: heroSlots }).map((_, index) => (
              <ImageSlot
                key={`hero-image-${index}`}
                label={heroLabels[index]}
                image={heroImages[index]}
                pageSlug={page.slug}
                onChange={(image) => setHeroImage(index, image)}
              />
            ))}
          </SectionCard>

          {(page.blocks ?? []).map((block, blockIndex) => {
            const maxImages = sectionImageLimit(block.type, page.slug);
            const sectionImages = block.images?.length ? block.images : [undefined];
            return (
            <SectionCard key={`${block.type}-${blockIndex}`} title={`Section ${blockIndex + 1}: ${block.type}`}>
              <Field label="Eyebrow" value={block.eyebrow ?? ""} onChange={(eyebrow) => updateBlock(blockIndex, { eyebrow })} />
              <Field label="Title" value={block.title ?? ""} onChange={(title) => updateBlock(blockIndex, { title })} />
              <Field label="Body" value={block.body ?? ""} onChange={(body) => updateBlock(blockIndex, { body })} multiline wide />

              {sectionImages.slice(0, maxImages).map((image, imageIndex) => (
                <ImageSlot
                  key={`block-${blockIndex}-image-${imageIndex}`}
                  label={imageIndex === 0 ? "Section Image" : `Section Image ${imageIndex + 1}`}
                  image={image}
                  pageSlug={page.slug}
                  onChange={(nextImage) => setBlockImage(blockIndex, imageIndex, nextImage)}
                />
              ))}

              {(block.images?.length ?? 0) < maxImages ? (
                <button
                  type="button"
                  onClick={() => setBlockImage(blockIndex, block.images?.length ?? 0, blankImage(page.slug, `Section ${blockIndex + 1} image`))}
                  className="rounded-full border border-forest/20 px-4 py-2 text-sm font-bold text-forest md:col-span-2"
                >
                  + Add section image
                </button>
              ) : null}

              {(block.items ?? []).map((item, itemIndex) => (
                <div key={`item-${blockIndex}-${itemIndex}`} className="rounded-[1.5rem] border border-dashed border-forest/15 p-4 md:col-span-2">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-burgundy">Card {itemIndex + 1}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Card Title"
                      value={item.title ?? ""}
                      onChange={(title) => {
                        updatePage((current) => {
                          const blocks = [...(current.blocks ?? [])];
                          const itemsList = [...(blocks[blockIndex].items ?? [])];
                          itemsList[itemIndex] = { ...itemsList[itemIndex], title };
                          blocks[blockIndex] = { ...blocks[blockIndex], items: itemsList };
                          return { ...current, blocks };
                        });
                      }}
                    />
                    <Field
                      label="Card Body"
                      value={item.body ?? ""}
                      onChange={(body) => {
                        updatePage((current) => {
                          const blocks = [...(current.blocks ?? [])];
                          const itemsList = [...(blocks[blockIndex].items ?? [])];
                          itemsList[itemIndex] = { ...itemsList[itemIndex], body };
                          blocks[blockIndex] = { ...blocks[blockIndex], items: itemsList };
                          return { ...current, blocks };
                        });
                      }}
                      multiline
                    />
                    <ImageSlot
                      label="Card Image"
                      image={item.image}
                      pageSlug={page.slug}
                      onChange={(image) => setBlockItemImage(blockIndex, itemIndex, image)}
                    />
                  </div>
                </div>
              ))}
            </SectionCard>
            );
          })}

          <div className="flex flex-wrap items-center gap-4 rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5">
            <button className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
              <Save className="h-4 w-4" /> Save Page
            </button>
            <button
              type="button"
              onClick={deletePage}
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
