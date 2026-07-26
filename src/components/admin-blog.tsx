"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Save, Trash2 } from "lucide-react";
import type { BlogPost, ImageAsset } from "@/lib/site";
import { AdminShell } from "@/components/admin";
import { ImageUploadField } from "@/components/ImageUploadField";

type EditablePost = BlogPost & Record<string, unknown>;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function postKey(post: EditablePost, index = 0) {
  return String(post.slug ?? `post-${index}`);
}

function blankImage(slug: string, label: string): ImageAsset {
  return {
    id: `${slug}-${label.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
    title: label,
    alt: label,
    url: "",
    page: "blog",
    status: "published",
  };
}

function ensureBlogImages(post: EditablePost): EditablePost {
  const featuredImage = post.featuredImage?.url
    ? post.featuredImage
    : blankImage(post.slug, "Featured Image");
  const inlineImages = [...(post.inlineImages ?? [])];
  while (inlineImages.length < 5) {
    inlineImages.push(blankImage(post.slug, `Inline Image ${inlineImages.length + 1}`));
  }
  return {
    ...post,
    featuredImage,
    inlineImages: inlineImages.slice(0, 5),
  };
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  wide = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  wide?: boolean;
  type?: string;
}) {
  const className = "mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none ring-forest/20 focus:ring-4";
  return (
    <label className={cx("block text-sm font-bold text-ink/70", wide && "md:col-span-2")}>
      {label}
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className={className} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={className} />
      )}
    </label>
  );
}

function ImageSlot({
  label,
  image,
  slug,
  onChange,
}: {
  label: string;
  image?: ImageAsset | null;
  slug: string;
  onChange: (image: ImageAsset) => void;
}) {
  return (
    <div className="md:col-span-2">
      <ImageUploadField
        label={label}
        folder="pages"
        value={image?.url || ""}
        onChange={(url) =>
          onChange({
            id: image?.id || `${slug}-${label.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
            title: image?.title || label,
            alt: image?.alt || label,
            caption: image?.caption ?? "",
            url,
            page: "blog",
            status: "published",
            width: image?.width ?? 1400,
            height: image?.height ?? 1000,
          })
        }
      />
      {image?.url ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
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

export function BlogsManager({ initialItems }: { initialItems: unknown[] }) {
  const [items, setItems] = useState<EditablePost[]>(() =>
    (initialItems as EditablePost[]).map((item) => ensureBlogImages(item)),
  );
  const [selectedKey, setSelectedKey] = useState(() => postKey((initialItems[0] ?? { slug: "post" }) as EditablePost, 0));
  const [status, setStatus] = useState("");
  const selectedIndex = items.findIndex((item, index) => postKey(item, index) === selectedKey);
  const post = selectedIndex >= 0 ? items[selectedIndex] : items[0];

  function updatePost(mutator: (current: EditablePost) => EditablePost) {
    if (!post) return;
    setItems((current) => {
      const index = current.findIndex((item, itemIndex) => postKey(item, itemIndex) === selectedKey);
      if (index < 0) return current;
      const next = [...current];
      next[index] = mutator(structuredClone(current[index]));
      return next;
    });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!post) return;
    setStatus("Saving...");
    const payload: EditablePost = {
      ...post,
      featuredImage: post.featuredImage?.url ? post.featuredImage : blankImage(post.slug, "Featured Image"),
      inlineImages: (post.inlineImages ?? []).filter((image) => Boolean(image?.url)).slice(0, 5),
    };
    if (!payload.featuredImage.url) {
      setStatus("Please upload a featured image before saving.");
      return;
    }

    const response = await fetch("/api/admin/content/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const next = await response.json();
    if (response.ok) {
      setItems((current) => current.map((item) => (item.slug === payload.slug ? ensureBlogImages(payload) : item)));
      setStatus("Saved. Live blog will show these updates.");
    } else {
      setStatus(next.error ?? "Unable to save.");
    }
  }

  async function deletePost() {
    if (!post?.slug || !window.confirm(`Delete blog post "${post.title}"?`)) return;
    setStatus("Deleting...");
    const response = await fetch("/api/admin/content/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: post.slug }),
    });
    const next = await response.json();
    if (response.ok) {
      const remaining = items.filter((item) => item.slug !== post.slug);
      setItems(remaining);
      setSelectedKey(postKey(remaining[0] ?? { slug: "post" }, 0));
      setStatus("Deleted.");
    } else {
      setStatus(next.error ?? "Unable to delete.");
    }
  }

  if (!post) {
    return (
      <AdminShell>
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">No blog posts found.</div>
      </AdminShell>
    );
  }

  const inlineImages = post.inlineImages ?? [];

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Blog CMS</p>
        <h1 className="mt-3 font-serif text-5xl text-forest">Edit blog posts and images.</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-ink/60">
          Update post copy and replace featured / inline images. Uploads save locally and show on the live blog.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <div className="max-h-[48rem] overflow-auto rounded-[2rem] bg-white p-3 shadow-xl shadow-black/5">
          {items.map((item, index) => {
            const key = postKey(item, index);
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
          <SectionCard title="Post details">
            <Field label="Title" value={post.title ?? ""} onChange={(title) => updatePost((current) => ({ ...current, title }))} wide />
            <Field label="URL Slug" value={post.slug ?? ""} onChange={(slug) => updatePost((current) => ({ ...current, slug }))} />
            <label className="block text-sm font-bold text-ink/70">
              Status
              <select
                value={post.status ?? "published"}
                onChange={(event) => updatePost((current) => ({ ...current, status: event.target.value as BlogPost["status"] }))}
                className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm"
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </label>
            <Field label="Category" value={post.category ?? ""} onChange={(category) => updatePost((current) => ({ ...current, category }))} />
            <Field label="Author" value={post.author ?? ""} onChange={(author) => updatePost((current) => ({ ...current, author }))} />
            <Field label="Publish Date" value={post.date ?? ""} onChange={(date) => updatePost((current) => ({ ...current, date }))} type="date" />
            <Field label="Excerpt" value={post.excerpt ?? ""} onChange={(excerpt) => updatePost((current) => ({ ...current, excerpt }))} multiline wide />
            <Field label="Post Body" value={post.body ?? ""} onChange={(body) => updatePost((current) => ({ ...current, body }))} multiline wide />
          </SectionCard>

          <SectionCard title="Featured image">
            <ImageSlot
              label="Featured Image"
              image={post.featuredImage}
              slug={post.slug}
              onChange={(featuredImage) => updatePost((current) => ({ ...current, featuredImage }))}
            />
          </SectionCard>

          <SectionCard title="Inline images">
            {inlineImages.slice(0, 5).map((image, index) => (
              <ImageSlot
                key={`${post.slug}-inline-${index}`}
                label={`Inline Image ${index + 1}`}
                image={image}
                slug={post.slug}
                onChange={(nextImage) =>
                  updatePost((current) => {
                    const list = [...(current.inlineImages ?? [])];
                    while (list.length <= index) list.push(blankImage(current.slug, `Inline Image ${list.length + 1}`));
                    list[index] = nextImage;
                    return { ...current, inlineImages: list.slice(0, 5) };
                  })
                }
              />
            ))}
          </SectionCard>

          <div className="flex flex-wrap items-center gap-4 rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5">
            <button className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
              <Save className="h-4 w-4" /> Save Post
            </button>
            <button
              type="button"
              onClick={deletePost}
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
