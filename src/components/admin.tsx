"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BarChart3, FileImage, LayoutDashboard, LogOut, PawPrint, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import type { CollectionName, ImageAsset } from "@/lib/site";
import type { BookingRequest } from "@/lib/site";
import type { SiteBrandLogos } from "@/lib/brand";
import { ImageUploadField } from "@/components/ImageUploadField";
import { prepareUploadPng, readUploadResponse } from "@/lib/prepare-upload-image";

const collections: { label: string; name: CollectionName }[] = [
  { label: "Pages", name: "pages" },
  { label: "Services", name: "services" },
  { label: "Pricing", name: "pricing" },
  { label: "FAQs", name: "faqs" },
  { label: "Blog", name: "blog" },
  { label: "Products", name: "products" },
  { label: "Team", name: "team" },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type EditableRecord = Record<string, unknown>;

export function AdminShell({ children }: { children: React.ReactNode }) {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <section className="min-h-screen bg-cream py-8">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 md:px-8 lg:grid-cols-[18rem_1fr]">
        <aside className="h-fit rounded-[2rem] bg-forest p-5 text-white shadow-2xl shadow-black/10">
          <div className="flex items-center gap-3 border-b border-white/15 pb-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-coral text-ink"><PawPrint className="h-5 w-5" /></span>
            <div>
              <p className="font-serif text-2xl">Admin</p>
              <p className="text-xs text-white/55">DTdogs CMS</p>
            </div>
          </div>
          <nav className="mt-5 grid gap-2">
            <AdminLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
            <AdminLink href="/admin/brand" icon={<PawPrint className="h-4 w-4" />} label="Brand Logos" />
            <AdminLink href="/admin/gallery" icon={<FileImage className="h-4 w-4" />} label="Gallery" />
            {collections.map((item) => (
              <AdminLink key={item.name} href={`/admin/${item.name}`} icon={<BarChart3 className="h-4 w-4" />} label={item.label} />
            ))}
            <button onClick={logout} className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-white/75 hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}

function AdminLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cx(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
        active ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white",
      )}
    >
      {icon} {label}
    </Link>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Signing in...");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setStatus("Invalid login or missing MongoDB/admin env configuration.");
    }
  }

  return (
    <section className="grid min-h-screen place-items-center bg-forest px-4 py-12 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white p-8 text-ink shadow-2xl">
        <PawPrint className="mb-6 h-10 w-10 text-forest" />
        <h1 className="font-serif text-5xl text-forest">Admin Login</h1>
        <label className="mt-8 block text-sm font-bold">
          Email
          <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3" />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Password
          <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3" />
        </label>
        <button className="mt-6 w-full rounded-full bg-forest px-6 py-3 font-bold text-white">Sign In</button>
        {status ? <p className="mt-4 text-sm text-burgundy">{status}</p> : null}
      </form>
    </section>
  );
}

export function Dashboard({ stats }: { stats: { label: string; value: number | string }[] }) {
  const [syncStatus, setSyncStatus] = useState("");

  async function syncSiteContent() {
    if (!window.confirm("Sync all site content to the admin database? This replaces services, FAQs, pricing, products, team, blog and pages with the current site defaults.")) return;
    setSyncStatus("Syncing...");
    const response = await fetch("/api/admin/sync", { method: "POST" });
    const data = await response.json();
    setSyncStatus(response.ok ? "Site content synced. Refresh collection pages to see updates." : data.error ?? "Sync failed.");
  }

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">CMS Dashboard</p>
        <h1 className="mt-3 font-serif text-6xl text-forest">Manage the DTdogs experience.</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink/65">Bookings, services, pages, media, pricing, products, blog, team and FAQs are connected to MongoDB. Edits here update the live site. Use Sync Site Content if the admin panel is out of date.</p>
        <button onClick={syncSiteContent} className="mt-6 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
          Sync Site Content
        </button>
        {syncStatus ? <p className="mt-3 text-sm text-burgundy">{syncStatus}</p> : null}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[2rem] bg-white p-7 shadow-xl shadow-black/5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-burgundy">{stat.label}</p>
            <p className="mt-4 font-serif text-5xl text-forest">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[2rem] bg-sage/70 p-7">
        <h2 className="font-serif text-4xl text-forest">Launch reminders</h2>
        <ul className="mt-5 grid gap-3 text-sm leading-6 text-ink/70 md:grid-cols-2">
          <li>Confirm official DTdogs / Hand & Paw brand relationship.</li>
          <li>Upload final client photography and replace sample media.</li>
          <li>Confirm prices, locations, policies and training details.</li>
          <li>Connect Google reviews/testimonials before launch.</li>
          <li>Configure Cloudinary, MongoDB and Resend environment variables.</li>
          <li>Run final Lighthouse, accessibility and booking submission checks.</li>
        </ul>
      </div>
    </AdminShell>
  );
}

function itemKey(item: EditableRecord, index = 0) {
  return String(item.slug ?? item.id ?? `item-${index}`);
}

export function ContentManager({ collection, initialItems }: { collection: CollectionName; initialItems: unknown[] }) {
  const [items, setItems] = useState<EditableRecord[]>(initialItems as EditableRecord[]);
  const [selectedKey, setSelectedKey] = useState(() => itemKey((initialItems[0] ?? {}) as EditableRecord, 0));
  const [status, setStatus] = useState("");
  const [formKey, setFormKey] = useState(0);
  const selectedIndex = items.findIndex((item, index) => itemKey(item, index) === selectedKey);
  const current = selectedIndex >= 0 ? items[selectedIndex] : items[0] ?? {};

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");
    const body = formToRecord(event.currentTarget, current, collection);
    const response = await fetch(`/api/admin/content/${collection}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const next = await response.json();
    setStatus(response.ok ? "Saved." : next.error ?? "Unable to save.");
    if (response.ok) {
      const key = (body.slug ?? body.id) as string;
      setItems((current) => {
        const index = current.findIndex((item, itemIndex) => itemKey(item, itemIndex) === selectedKey || itemKey(item, itemIndex) === key);
        if (index === -1) return [body, ...current];
        const copy = [...current];
        copy[index] = body;
        return copy;
      });
      setSelectedKey(key);
    }
  }

  async function deleteItem() {
    const key = current.slug ?? current.id;
    if (!key || !window.confirm("Delete this item? This cannot be undone.")) return;
    setStatus("Deleting...");
    const response = await fetch(`/api/admin/content/${collection}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(current.slug ? { slug: current.slug } : { id: current.id }),
    });
    const next = await response.json();
    if (response.ok) {
      const remaining = items.filter((item, index) => itemKey(item, index) !== key);
      setItems(remaining);
      setSelectedKey(itemKey(remaining[0] ?? {}, 0));
      setFormKey((prev) => prev + 1);
      setStatus("Deleted.");
    } else {
      setStatus(next.error ?? "Unable to delete.");
    }
  }

  function createNew() {
    const template = createTemplate(collection);
    setItems([template, ...items]);
    setSelectedKey(itemKey(template));
    setFormKey((prev) => prev + 1);
  }

  function selectItem(key: string) {
    setSelectedKey(key);
    setStatus("");
    setFormKey((prev) => prev + 1);
  }

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Content manager</p>
            <h1 className="mt-3 font-serif text-5xl capitalize text-forest">{collectionLabels[collection] ?? collection}</h1>
            <p className="mt-2 text-sm text-ink/60">Edit content with normal fields. No code or JSON needed.</p>
          </div>
          <button onClick={createNew} className="rounded-full bg-forest px-5 py-3 font-bold text-white">Add item</button>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="max-h-[42rem] overflow-auto rounded-[2rem] bg-white p-3 shadow-xl shadow-black/5">
          {items.map((item, index) => {
            const record = item as Record<string, unknown>;
            const label = String(record.title ?? record.name ?? record.question ?? record.slug ?? record.id ?? `Item ${index + 1}`);
            const key = itemKey(item, index);
            return (
              <button key={key} onClick={() => selectItem(key)} className={cx("mb-2 block w-full rounded-2xl px-4 py-3 text-left text-sm", selectedKey === key ? "bg-forest text-white" : "bg-cream hover:bg-sage")}>
                {label}
              </button>
            );
          })}
        </div>
        <form onSubmit={save} key={formKey} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5">
          <div className="grid gap-5 md:grid-cols-2">
            {getFields(collection).map((field) => (
              <AdminFormField key={field.path} field={field} value={getPath(current, field.path)} />
            ))}
          </div>
          {collection === "pages" ? <PageSectionsEditor record={current} /> : null}
          {collection === "services" ? <ServiceFaqEditor record={current} /> : null}
          {collection === "team" ? (
            <TeamPhotoEditor
              record={current}
              onImageChange={(image) => {
                setItems((list) =>
                  list.map((item, itemIndex) =>
                    itemKey(item, itemIndex) === selectedKey ? { ...item, image } : item,
                  ),
                );
              }}
            />
          ) : null}
          {collection === "team" ? <TeamSocialLinksEditor record={current} /> : null}
          {collection === "products" ? (
            <ProductImagesEditor
              record={current}
              onImagesChange={(images) => {
                setItems((list) =>
                  list.map((item, itemIndex) =>
                    itemKey(item, itemIndex) === selectedKey ? { ...item, images } : item,
                  ),
                );
              }}
            />
          ) : null}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
              <Save className="h-4 w-4" /> Save
            </button>
            <button type="button" onClick={deleteItem} className="inline-flex items-center gap-2 rounded-full border border-burgundy px-5 py-3 font-bold text-burgundy transition hover:bg-burgundy hover:text-white">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            <p className="text-sm text-burgundy">{status}</p>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}

type FieldKind = "text" | "textarea" | "select" | "checkbox" | "number" | "date" | "list";
type FieldConfig = {
  path: string;
  label: string;
  type?: FieldKind;
  options?: string[];
  wide?: boolean;
  help?: string;
};

const collectionLabels: Partial<Record<CollectionName, string>> = {
  pages: "Pages",
  services: "Services",
  pricing: "Pricing",
  testimonials: "Testimonials",
  faqs: "FAQs",
  blog: "Blog",
  products: "Products",
  team: "Team",
};

function getFields(collection: CollectionName): FieldConfig[] {
  const statusOptions = ["published", "draft", "hidden", "inquiry"];
  const common = [
    { path: "slug", label: "URL Slug" },
    { path: "status", label: "Status", type: "select" as const, options: statusOptions },
  ];

  const fields: Partial<Record<CollectionName, FieldConfig[]>> = {
    pages: [
      { path: "title", label: "Page Title" },
      { path: "navTitle", label: "Navigation Title" },
      ...common,
      { path: "seoTitle", label: "SEO Title", wide: true },
      { path: "metaDescription", label: "Meta Description", type: "textarea", wide: true },
      { path: "hero.eyebrow", label: "Hero Eyebrow" },
      { path: "hero.title", label: "Hero Heading", type: "textarea", wide: true },
      { path: "hero.body", label: "Hero Text", type: "textarea", wide: true },
      { path: "hero.primaryCta.label", label: "Primary Button Text" },
      { path: "hero.primaryCta.href", label: "Primary Button Link" },
      { path: "hero.secondaryCta.label", label: "Secondary Button Text" },
      { path: "hero.secondaryCta.href", label: "Secondary Button Link" },
    ],
    services: [
      { path: "name", label: "Service Name" },
      ...common,
      { path: "eyebrow", label: "Small Label" },
      { path: "summary", label: "Card Summary", type: "textarea", wide: true },
      { path: "description", label: "Full Description", type: "textarea", wide: true },
      { path: "forWhom", label: "Who It Is For", type: "textarea", wide: true },
      { path: "priceLabel", label: "Price Label" },
      { path: "duration", label: "Duration" },
      { path: "discountPercent", label: "Discount % (0–100)", type: "number", help: "Optional percent off before tax." },
      { path: "featured", label: "Featured Service", type: "checkbox" },
      { path: "benefits", label: "Benefits", type: "list", wide: true, help: "One benefit per line." },
      { path: "includes", label: "What Is Included", type: "list", wide: true, help: "One included item per line." },
      { path: "process", label: "Service Process", type: "list", wide: true, help: "One step per line." },
      { path: "related", label: "Related Service Slugs", type: "list", wide: true, help: "One service slug per line." },
    ],
    pricing: [
      { path: "service", label: "Service" },
      { path: "name", label: "Package Name" },
      ...common,
      { path: "priceLabel", label: "Price / Quote Label" },
      { path: "duration", label: "Duration" },
      { path: "featured", label: "Featured Package", type: "checkbox" },
      { path: "features", label: "Features", type: "list", wide: true, help: "One feature per line." },
    ],
    faqs: [
      { path: "question", label: "Question", wide: true },
      ...common,
      { path: "answer", label: "Answer", type: "textarea", wide: true },
      { path: "category", label: "Category" },
      { path: "serviceSlug", label: "Related Service Slug" },
      { path: "order", label: "Display Order", type: "number" },
    ],
    blog: [
      { path: "title", label: "Post Title" },
      ...common,
      { path: "excerpt", label: "Excerpt", type: "textarea", wide: true },
      { path: "category", label: "Category" },
      { path: "author", label: "Author" },
      { path: "date", label: "Publish Date", type: "date" },
      { path: "body", label: "Post Body", type: "textarea", wide: true },
      { path: "featuredImage.title", label: "Featured Image Title" },
      { path: "featuredImage.url", label: "Featured Image URL (paste Cloudinary link)", wide: true },
      { path: "featuredImage.alt", label: "Featured Image Alt Text", wide: true },
    ],
    products: [
      { path: "title", label: "Product Title" },
      ...common,
      { path: "description", label: "Description", type: "textarea", wide: true },
      { path: "priceLabel", label: "Price Label" },
      { path: "compareAtPriceLabel", label: "Compare At Price (optional)" },
      { path: "inventory", label: "Inventory", type: "number" },
      { path: "sizes", label: "Sizes", type: "list", help: "One size per line (e.g., S, M, L, XL)." },
      { path: "colors", label: "Colors", type: "list", help: "One color per line." },
    ],
    team: [
      { path: "name", label: "Name" },
      ...common,
      { path: "role", label: "Role" },
      { path: "bio", label: "Bio", type: "textarea", wide: true },
      { path: "credentials", label: "Credentials", type: "list", wide: true, help: "One credential per line." },
    ],
    testimonials: [
      { path: "reviewer", label: "Reviewer Name" },
      ...common,
      { path: "petName", label: "Pet Name" },
      { path: "service", label: "Service" },
      { path: "rating", label: "Rating (1-5)", type: "number" },
      { path: "quote", label: "Testimonial Quote", type: "textarea", wide: true },
      { path: "location", label: "Location" },
      { path: "sample", label: "Sample Testimonial", type: "checkbox" },
      { path: "image.title", label: "Photo Title" },
      { path: "image.url", label: "Photo Image URL (paste Cloudinary link)", wide: true },
      { path: "image.alt", label: "Photo Alt Text", wide: true },
    ],
  };

  return fields[collection] ?? common;
}

function AdminFormField({ field, value }: { field: FieldConfig; value: unknown }) {
  const baseClass = "mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none ring-forest/20 focus:ring-4";
  const stringValue = field.type === "list" ? arrayToLines(value) : valueToString(value);

  return (
    <label className={cx("block text-sm font-bold text-ink/70", field.wide && "md:col-span-2")}>
      {field.label}
      {field.help ? <span className="ml-2 font-normal text-ink/45">{field.help}</span> : null}
      {field.type === "textarea" || field.type === "list" ? (
        <textarea name={field.path} defaultValue={stringValue} rows={field.type === "list" ? 5 : 4} className={baseClass} />
      ) : field.type === "select" ? (
        <select name={field.path} defaultValue={stringValue} className={baseClass}>
          <option value="">Choose</option>
          {field.options?.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : field.type === "checkbox" ? (
        <span className="mt-3 flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
          <input name={field.path} type="checkbox" defaultChecked={Boolean(value)} className="h-5 w-5" />
          <span className="font-normal">Enabled</span>
        </span>
      ) : (
        <input name={field.path} type={field.type ?? "text"} defaultValue={stringValue} className={baseClass} />
      )}
    </label>
  );
}

function PageSectionsEditor({ record }: { record: EditableRecord }) {
  const blocks = Array.isArray(record.blocks) ? (record.blocks as EditableRecord[]) : [];
  if (!blocks.length) return null;

  return (
    <div className="mt-8 rounded-[2rem] bg-sage/60 p-5 md:col-span-2">
      <h2 className="font-serif text-3xl text-forest">Page Sections</h2>
      <p className="mt-1 text-sm text-ink/60">Edit section headings and text shown below the hero.</p>
      <div className="mt-5 grid gap-5">
        {blocks.map((block, index) => (
          <div key={`${block.title}-${index}`} className="grid gap-4 rounded-[1.5rem] bg-white p-5 md:grid-cols-2">
            <AdminFormField field={{ path: `blocks.${index}.eyebrow`, label: "Section Label" }} value={block.eyebrow} />
            <AdminFormField field={{ path: `blocks.${index}.title`, label: "Section Heading" }} value={block.title} />
            <AdminFormField field={{ path: `blocks.${index}.body`, label: "Section Text", type: "textarea", wide: true }} value={block.body} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceFaqEditor({ record }: { record: EditableRecord }) {
  const faqs = Array.isArray(record.faqs) ? (record.faqs as EditableRecord[]) : [];
  if (!faqs.length) return null;

  return (
    <div className="mt-8 rounded-[2rem] bg-sage/60 p-5 md:col-span-2">
      <h2 className="font-serif text-3xl text-forest">Service FAQs</h2>
      <div className="mt-5 grid gap-5">
        {faqs.map((faq, index) => (
          <div key={`${faq.question}-${index}`} className="grid gap-4 rounded-[1.5rem] bg-white p-5">
            <AdminFormField field={{ path: `faqs.${index}.question`, label: "Question" }} value={faq.question} />
            <AdminFormField field={{ path: `faqs.${index}.answer`, label: "Answer", type: "textarea" }} value={faq.answer} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamPhotoEditor({
  record,
  onImageChange,
}: {
  record: EditableRecord;
  onImageChange: (image: ImageAsset) => void;
}) {
  const image = (record.image && typeof record.image === "object" ? record.image : {}) as Partial<ImageAsset>;
  const url = typeof image.url === "string" ? image.url : "";
  const name = String(record.name ?? "Team member");

  return (
    <div className="mt-8 rounded-[2rem] bg-sage/60 p-5">
      <h2 className="font-serif text-3xl text-forest">Profile Photo</h2>
      <p className="mt-2 text-sm text-ink/60">
        Upload a circular portrait for this team member. It appears on the Team page as a round photo.
      </p>
      <div className="mt-5 grid gap-4 rounded-[1.5rem] bg-white p-5 md:grid-cols-[10rem_1fr] md:items-start">
        <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-[3px] border-white bg-cream shadow-md ring-2 ring-forest/15">
          {url ? (
            <Image
              src={url}
              alt={image.alt || name}
              width={160}
              height={160}
              className="h-full w-full object-cover"
              unoptimized={
                url.startsWith("/api/uploads/") ||
                url.startsWith("/api/media/file/") ||
                url.startsWith("data:image/") ||
                url.startsWith("/uploads/")
              }
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-ink/40">No photo</div>
          )}
        </div>
        <div className="grid gap-4">
          <ImageUploadField
            label="Team member photo"
            folder="misc"
            value={url}
            onChange={(nextUrl) =>
              onImageChange({
                id: image.id || `team-${String(record.slug ?? "member")}-${Date.now()}`,
                title: image.title || name,
                alt: image.alt || `${name} portrait`,
                caption: image.caption ?? "",
                url: nextUrl,
                page: "team",
                status: "published",
                width: image.width ?? 800,
                height: image.height ?? 800,
              })
            }
          />
          <AdminFormField field={{ path: "image.alt", label: "Photo Alt Text", wide: true }} value={image.alt} />
        </div>
      </div>
    </div>
  );
}

function TeamSocialLinksEditor({ record }: { record: EditableRecord }) {
  return (
    <div className="mt-8 rounded-[2rem] bg-sage/60 p-5">
      <h2 className="font-serif text-3xl text-forest">Social Links</h2>
      <p className="mt-2 text-sm text-ink/60">Optional profile links shown on the team page. Leave blank to hide.</p>
      <div className="mt-5 grid gap-4 rounded-[1.5rem] bg-white p-5">
        <AdminFormField
          field={{ path: "instagram", label: "Instagram URL", wide: true, help: "e.g. https://www.instagram.com/username/" }}
          value={record.instagram}
        />
        <AdminFormField
          field={{ path: "facebook", label: "Facebook URL", wide: true, help: "e.g. https://www.facebook.com/username" }}
          value={record.facebook}
        />
        <AdminFormField
          field={{ path: "website", label: "Website URL", wide: true, help: "e.g. https://example.com" }}
          value={record.website}
        />
      </div>
    </div>
  );
}

function ProductImagesEditor({
  record,
  onImagesChange,
}: {
  record: EditableRecord;
  onImagesChange: (images: ImageAsset[]) => void;
}) {
  const images = Array.isArray(record.images) ? ([...record.images] as ImageAsset[]) : [];
  while (images.length < 3) {
    images.push({
      id: `product-image-${images.length + 1}-${Date.now()}`,
      title: `Product Image ${images.length + 1}`,
      alt: `Product Image ${images.length + 1}`,
      url: "",
      status: "published",
    });
  }

  function setImageUrl(index: number, url: string) {
    const next = images.map((image, imageIndex) =>
      imageIndex === index
        ? {
            ...image,
            id: image.id || `product-image-${index + 1}-${Date.now()}`,
            title: image.title || `Product Image ${index + 1}`,
            alt: image.alt || `Product Image ${index + 1}`,
            url,
            status: "published" as const,
          }
        : image,
    );
    onImagesChange(next.filter((image) => Boolean(image.url)).length ? next : next.slice(0, 3));
  }

  return (
    <div className="mt-8 rounded-[2rem] bg-sage/60 p-5">
      <h2 className="font-serif text-3xl text-forest">Product Images</h2>
      <p className="mt-2 text-sm text-ink/60">Upload images to MongoDB. These URLs are stored on the product and work after Vercel deploy.</p>
      <div className="mt-5 grid gap-4">
        {images.slice(0, 3).map((image, index) => (
          <ImageUploadField
            key={`${image.id}-${index}`}
            label={`Product Image ${index + 1}`}
            folder="products"
            value={image.url || ""}
            onChange={(url) => setImageUrl(index, url)}
          />
        ))}
      </div>
    </div>
  );
}

function formToRecord(form: HTMLFormElement, current: EditableRecord, collection: CollectionName) {
  const next = structuredClone(current) as EditableRecord;
  const data = new FormData(form);
  const fields = [...getFields(collection)];

  if (collection === "pages") {
    const blocks = Array.isArray(next.blocks) ? (next.blocks as EditableRecord[]) : [];
    blocks.forEach((_, index) => {
      fields.push(
        { path: `blocks.${index}.eyebrow`, label: "Section Label" },
        { path: `blocks.${index}.title`, label: "Section Heading" },
        { path: `blocks.${index}.body`, label: "Section Text", type: "textarea" },
      );
    });
  }

  if (collection === "services") {
    const faqs = Array.isArray(next.faqs) ? (next.faqs as EditableRecord[]) : [];
    faqs.forEach((_, index) => {
      fields.push(
        { path: `faqs.${index}.question`, label: "Question" },
        { path: `faqs.${index}.answer`, label: "Answer", type: "textarea" },
      );
    });
  }

  if (collection === "team") {
    fields.push(
      { path: "image.alt", label: "Photo Alt Text", wide: true },
      { path: "instagram", label: "Instagram URL", wide: true },
      { path: "facebook", label: "Facebook URL", wide: true },
      { path: "website", label: "Website URL", wide: true },
    );
  }

  fields.forEach((field) => {
    if (field.type === "checkbox") {
      setPath(next, field.path, data.has(field.path));
      return;
    }

    const raw = String(data.get(field.path) ?? "");
    if (field.type === "list") {
      setPath(next, field.path, linesToArray(raw));
    } else if (field.type === "number") {
      setPath(next, field.path, Number(raw) || 0);
    } else {
      setPath(next, field.path, raw);
    }
  });

  return next;
}

function createTemplate(collection: CollectionName): EditableRecord {
  const slug = `new-${collection}-${Date.now()}`;
  const base = { slug, status: "draft" };
  switch (collection) {
    case "services":
      return { ...base, name: "New Service", eyebrow: "", summary: "", description: "", forWhom: "", benefits: [], includes: [], process: [], related: [], faqs: [], images: [], discountPercent: 0 };
    case "pricing":
      return { ...base, service: "New Service", name: "New Package", priceLabel: "Request Pricing", duration: "", features: [], featured: false };
    case "testimonials":
      return { ...base, reviewer: "New Reviewer", petName: "", service: "", rating: 5, quote: "", location: "", sample: false, image: { title: "", url: "", alt: "" } };
    case "faqs":
      return { ...base, question: "New Question", answer: "", category: "General" };
    case "blog":
      return { ...base, title: "New Blog Post", excerpt: "", category: "", author: "DTdogs.ca", date: new Date().toISOString().slice(0, 10), body: "", featuredImage: { title: "", url: "", alt: "" } };
    case "products":
      return { ...base, title: "New Product", description: "", priceLabel: "Price to be confirmed", sizes: [], colors: [], inventory: 0, images: [] };
    case "team":
      return {
        ...base,
        name: "New Team Member",
        role: "",
        bio: "",
        credentials: [],
        image: { id: `team-${slug}`, title: "New Team Member", url: "", alt: "Team member portrait", page: "team", status: "published" },
        instagram: "",
        facebook: "",
        website: "",
      };
    default:
      return { ...base, title: "New Page", navTitle: "New Page", seoTitle: "", metaDescription: "", hero: { eyebrow: "", title: "", body: "" }, blocks: [] };
  }
}

function getPath(source: EditableRecord, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value == null) return undefined;
    if (Array.isArray(value)) return value[Number(key)];
    if (typeof value === "object") return (value as EditableRecord)[key];
    return undefined;
  }, source);
}

function setPath(target: EditableRecord, path: string, value: unknown) {
  const parts = path.split(".");
  let cursor: EditableRecord | unknown[] = target;

  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;
    const nextPart = parts[index + 1];
    const key = Array.isArray(cursor) ? Number(part) : part;

    if (isLast) {
      (cursor as Record<string | number, unknown>)[key] = value;
      return;
    }

    const existing = (cursor as Record<string | number, unknown>)[key];
    if (existing == null) {
      (cursor as Record<string | number, unknown>)[key] = Number.isFinite(Number(nextPart)) ? [] : {};
    }
    cursor = (cursor as Record<string | number, unknown>)[key] as EditableRecord | unknown[];
  });
}

function valueToString(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "";
}

function arrayToLines(value: unknown) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function linesToArray(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function MediaLibrary({ initialItems }: { initialItems: ImageAsset[] }) {
  const [items, setItems] = useState<ImageAsset[]>(initialItems);
  const [editing, setEditing] = useState<ImageAsset | null>(null);
  const [status, setStatus] = useState("");

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Uploading...");
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const raw = formData.get("file");
      if (!(raw instanceof File) || !raw.size) {
        setStatus("Choose an image file first.");
        return;
      }
      formData.set("file", await prepareUploadPng(raw));
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await readUploadResponse(response);
      if (response.ok) {
        setItems([data.asset as ImageAsset, ...items]);
        setStatus(
          data.message
            ? `Uploaded as PNG (${String(data.storage)}). ${String(data.message)}`
            : "Uploaded and saved as PNG.",
        );
        try {
          form.reset();
        } catch {
          // Form may unmount during re-render after upload.
        }
      } else {
        setStatus(String(data.error ?? "Upload failed."));
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  async function saveMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setStatus("Saving image...");
    const form = new FormData(event.currentTarget);
    const next: ImageAsset = {
      ...editing,
      title: String(form.get("title") ?? editing.title),
      alt: String(form.get("alt") ?? editing.alt),
      caption: String(form.get("caption") ?? ""),
      page: String(form.get("page") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: String(form.get("status") ?? "published") as ImageAsset["status"],
      focalPoint: {
        x: Number(form.get("focalX") ?? editing.focalPoint?.x ?? 50),
        y: Number(form.get("focalY") ?? editing.focalPoint?.y ?? 50),
      },
    };
    const response = await fetch("/api/admin/content/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await response.json();
    if (response.ok) {
      setItems((current) => current.map((image) => (image.id === next.id ? next : image)));
      setEditing(null);
      setStatus("Image updated.");
    } else {
      setStatus(data.error ?? "Unable to update image.");
    }
  }

  async function deleteMedia(image: ImageAsset) {
    if (!window.confirm(`Delete "${image.title}" from the media library?`)) return;
    setStatus("Deleting image...");
    const response = await fetch("/api/admin/content/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image.id }),
    });
    const data = await response.json();
    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== image.id));
      setStatus("Image deleted.");
    } else {
      setStatus(data.error ?? "Unable to delete image.");
    }
  }

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Media Library</p>
        <h1 className="mt-3 font-serif text-6xl text-forest">Upload, assign and manage images.</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink/65">Images upload to Cloudinary and metadata is stored in MongoDB, including alt text, captions, assigned page, tags, focal points and publish status.</p>
      </div>
      <form onSubmit={upload} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-3">
        <input name="file" type="file" accept="image/*,video/*" required className="rounded-2xl bg-cream p-3" />
        <input name="title" placeholder="Image title" required className="rounded-2xl bg-cream px-4 py-3" />
        <input name="alt" placeholder="Meaningful alt text" required className="rounded-2xl bg-cream px-4 py-3" />
        <input name="caption" placeholder="Caption" className="rounded-2xl bg-cream px-4 py-3" />
        <input name="page" placeholder="Assigned page" className="rounded-2xl bg-cream px-4 py-3" />
        <input name="tags" placeholder="Tags, comma separated" className="rounded-2xl bg-cream px-4 py-3" />
        <input name="focalX" placeholder="Focal X 50" type="number" className="rounded-2xl bg-cream px-4 py-3" />
        <input name="focalY" placeholder="Focal Y 50" type="number" className="rounded-2xl bg-cream px-4 py-3" />
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white">
          <Upload className="h-4 w-4" /> Upload
        </button>
        {status ? <p className="md:col-span-3 text-sm text-burgundy">{status}</p> : null}
      </form>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((image) => (
          <article key={image.id} className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">
            <Image src={image.url} alt={image.alt} width={image.width ?? 800} height={image.height ?? 600} className="h-64 w-full object-cover" />
            <div className="p-5">
              <h2 className="font-serif text-3xl text-forest">{image.title}</h2>
              <dl className="mt-4 grid gap-2 text-sm text-ink/65">
                <div><dt className="font-bold text-ink">Alt</dt><dd>{image.alt}</dd></div>
                <div><dt className="font-bold text-ink">Page</dt><dd>{image.page ?? "Unassigned"}</dd></div>
                <div><dt className="font-bold text-ink">Dimensions</dt><dd>{image.width ?? "?"} x {image.height ?? "?"}</dd></div>
                <div><dt className="font-bold text-ink">Size</dt><dd>{image.fileSize ? `${Math.round(image.fileSize / 1024)} KB` : "Unknown"}</dd></div>
                <div><dt className="font-bold text-ink">Status</dt><dd>{image.status ?? "published"}</dd></div>
              </dl>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setEditing(image)} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-bold text-white transition hover:bg-burgundy">
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <button onClick={() => deleteMedia(image)} className="inline-flex items-center gap-2 rounded-full border border-burgundy px-4 py-2 text-sm font-bold text-burgundy transition hover:bg-burgundy hover:text-white">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={saveMedia} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Edit image</p>
                <h2 className="mt-2 font-serif text-4xl text-forest">{editing.title}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-full bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Image src={editing.url} alt={editing.alt} width={editing.width ?? 800} height={editing.height ?? 600} className="mt-5 h-64 w-full rounded-[1.5rem] object-cover" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <MediaInput name="title" label="Title" defaultValue={editing.title} required />
              <MediaInput name="alt" label="Alt Text" defaultValue={editing.alt} required />
              <MediaInput name="caption" label="Caption" defaultValue={editing.caption ?? ""} wide />
              <MediaInput name="page" label="Assigned Page" defaultValue={editing.page ?? ""} />
              <MediaInput name="tags" label="Tags" defaultValue={(editing.tags ?? []).join(", ")} />
              <label className="block text-sm font-bold text-ink/70">
                Publish Status
                <select name="status" defaultValue={editing.status ?? "published"} className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3">
                  <option value="published">published</option>
                  <option value="hidden">hidden</option>
                  <option value="draft">draft</option>
                </select>
              </label>
              <MediaInput name="focalX" label="Focal Point X" type="number" defaultValue={String(editing.focalPoint?.x ?? 50)} />
              <MediaInput name="focalY" label="Focal Point Y" type="number" defaultValue={String(editing.focalPoint?.y ?? 50)} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
                <Save className="h-4 w-4" /> Save Image
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-forest/20 px-5 py-3 font-bold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}

export function BrandLogosManager({ initialBrand }: { initialBrand: SiteBrandLogos }) {
  const [brand, setBrand] = useState<SiteBrandLogos>(initialBrand);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus("Saving...");
    try {
      const response = await fetch("/api/admin/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error ?? "Unable to save brand logos.");
        return;
      }
      setBrand(data);
      setStatus("Saved. Header, footer and intro logos will update on the live site.");
    } catch {
      setStatus("Unable to save brand logos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Brand</p>
        <h1 className="mt-3 font-serif text-5xl text-forest">Logos</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink/65">
          Upload the header navbar logo, intro splash logo, and footer logo. Changes are stored in MongoDB and used across the live site.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-forest/10 bg-cream/60 p-5">
            <ImageUploadField
              label="Header logo"
              folder="misc"
              value={brand.headerLogo}
              onChange={(headerLogo) => setBrand((current) => ({ ...current, headerLogo }))}
            />
            <p className="mt-3 text-xs leading-5 text-ink/55">Used in the top navigation bar.</p>
          </div>
          <div className="rounded-[1.5rem] border border-forest/10 bg-cream/60 p-5">
            <ImageUploadField
              label="Intro logo"
              folder="misc"
              value={brand.introLogo}
              onChange={(introLogo) => setBrand((current) => ({ ...current, introLogo }))}
            />
            <p className="mt-3 text-xs leading-5 text-ink/55">Used on the first-visit intro splash screen.</p>
          </div>
          <div className="rounded-[1.5rem] border border-forest/10 bg-cream/60 p-5">
            <ImageUploadField
              label="Footer logo"
              folder="misc"
              value={brand.footerLogo}
              onChange={(footerLogo) => setBrand((current) => ({ ...current, footerLogo }))}
            />
            <p className="mt-3 text-xs leading-5 text-ink/55">Used in the site footer branding block.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-bold text-white transition hover:bg-burgundy disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Logos"}
          </button>
          {status ? <p className="text-sm text-burgundy">{status}</p> : null}
        </div>
      </div>
    </AdminShell>
  );
}

// Gallery Manager - manages only gallery page images
export function GalleryManager({ initialItems = [] }: { initialItems?: ImageAsset[] }) {
  const [items, setItems] = useState<ImageAsset[]>(initialItems);
  const [editing, setEditing] = useState<ImageAsset | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(initialItems.length === 0);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        if (!active) return;
        if (response.ok && Array.isArray(data)) {
          setItems(data);
        } else if (response.ok && Array.isArray(data?.images)) {
          setItems(data.images);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
        if (active) setStatus("Unable to load gallery images.");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchGallery();
    return () => {
      active = false;
    };
  }, []);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Uploading...");
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const raw = formData.get("file");
      if (!(raw instanceof File) || !raw.size) {
        setStatus("Choose an image file first.");
        return;
      }
      const prepared = await prepareUploadPng(raw);
      formData.set("file", prepared);
      formData.set("folder", "gallery");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await readUploadResponse(response);
      if (response.ok) {
        const title = String(formData.get("title") ?? "Gallery image");
        const galleryResponse = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: `gallery-${Date.now()}`,
            title,
            alt: String(formData.get("alt") ?? title),
            caption: String(formData.get("caption") ?? ""),
            url: data.url,
            width: 1400,
            height: 1000,
            tags: ["Gallery"],
            status: "published",
            order: items.length + 1,
          }),
        });
        const galleryData = await galleryResponse.json();

        if (galleryResponse.ok) {
          setItems((current) => [galleryData.gallery, ...current]);
          setStatus("Uploaded to gallery as PNG!");
          try {
            form.reset();
          } catch {
            // Form may unmount during re-render after upload.
          }
        } else {
          setStatus(galleryData.error ?? "Uploaded but failed to add to gallery.");
        }
      } else {
        setStatus(String(data.error ?? "Upload failed."));
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  async function replaceImage(image: ImageAsset, file: File) {
    setStatus("Replacing image...");
    try {
      const prepared = await prepareUploadPng(file);
      const form = new FormData();
      form.set("file", prepared);
      form.set("folder", "gallery");

      const uploadResponse = await fetch("/api/upload", { method: "POST", body: form });
      const uploadData = await readUploadResponse(uploadResponse);
      if (!uploadResponse.ok) {
        setStatus(String(uploadData.error ?? "Upload failed."));
        return;
      }

      const next: ImageAsset = {
        ...image,
        url: String(uploadData.url),
        fileSize: typeof uploadData.size === "number" ? uploadData.size : image.fileSize,
      };

      const response = await fetch(`/api/gallery/${image.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await response.json();
      if (response.ok) {
        setItems((current) => current.map((item) => (item.id === image.id ? next : item)));
        if (editing?.id === image.id) setEditing(next);
        setStatus("Gallery image replaced (PNG).");
      } else {
        setStatus(data.error ?? "Unable to replace image.");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  async function saveGallery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setStatus("Saving...");
    const form = new FormData(event.currentTarget);
    const next: ImageAsset = {
      ...editing,
      title: String(form.get("title") ?? editing.title),
      alt: String(form.get("alt") ?? editing.alt),
      caption: String(form.get("caption") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: String(form.get("status") ?? "published") as ImageAsset["status"],
      order: Number(form.get("order") ?? editing.order ?? 0),
    };

    const response = await fetch(`/api/gallery/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const data = await response.json();

    if (response.ok) {
      setItems((current) => current.map((image) => (image.id === next.id ? next : image)));
      setEditing(null);
      setStatus("Gallery image updated.");
    } else {
      setStatus(data.error ?? "Unable to update image.");
    }
  }

  async function deleteGallery(image: ImageAsset) {
    if (!window.confirm(`Delete "${image.title}" from gallery?`)) return;
    setStatus("Deleting...");
    const response = await fetch(`/api/gallery/${image.id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== image.id));
      setStatus("Image deleted from gallery.");
    } else {
      setStatus(data.error ?? "Unable to delete image.");
    }
  }

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Gallery Management</p>
        <h1 className="mt-3 font-serif text-6xl text-forest">Manage gallery page images.</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink/65">
          These images appear on the /gallery page. Replace existing photos, edit details, or upload new gallery images.
        </p>
        <p className="mt-2 text-sm text-ink/50">{items.length} images in gallery</p>
      </div>

      <form onSubmit={upload} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-3">
        <input name="file" type="file" accept="image/*" required className="rounded-2xl bg-cream p-3" />
        <input name="title" placeholder="Image title" required className="rounded-2xl bg-cream px-4 py-3" />
        <input name="alt" placeholder="Alt text" required className="rounded-2xl bg-cream px-4 py-3" />
        <input name="caption" placeholder="Caption" className="rounded-2xl bg-cream px-4 py-3 md:col-span-2" />
        <input name="tags" placeholder="Tags (comma separated)" className="rounded-2xl bg-cream px-4 py-3" />
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white">
          <Upload className="h-4 w-4" /> Add New Gallery Image
        </button>
        {status ? <p className="md:col-span-3 text-sm text-burgundy">{status}</p> : null}
      </form>

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          const target = items.find((item) => item.id === replacingId);
          if (file && target) void replaceImage(target, file);
          event.target.value = "";
          setReplacingId(null);
        }}
      />

      {loading ? (
        <div className="mt-6 text-center text-ink/60">Loading gallery images...</div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-[2rem] bg-white p-8 text-center text-ink/60">
              No gallery images yet. Upload your first image above!
            </div>
          ) : (
            items
              .filter((image) => image && image.url)
              .map((image) => (
                <article key={image.id} className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">
                  <Image
                    src={image.url}
                    alt={image.alt || "Gallery image"}
                    width={image.width ?? 800}
                    height={image.height ?? 600}
                    className="h-64 w-full object-cover"
                    unoptimized={image.url.startsWith("/api/uploads/") || image.url.startsWith("/uploads/") || image.url.startsWith("/api/media/file/") || image.url.startsWith("data:image/")}
                  />
                  <div className="p-5">
                    <h2 className="font-serif text-3xl text-forest">{image.title || "Untitled"}</h2>
                    <dl className="mt-4 grid gap-2 text-sm text-ink/65">
                      <div>
                        <dt className="font-bold text-ink">Alt</dt>
                        <dd>{image.alt || "No alt text"}</dd>
                      </div>
                      {image.caption ? (
                        <div>
                          <dt className="font-bold text-ink">Caption</dt>
                          <dd>{image.caption}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt className="font-bold text-ink">Tags</dt>
                        <dd>{image.tags?.join(", ") || "None"}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-ink">Order</dt>
                        <dd>{image.order ?? 0}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-ink">Status</dt>
                        <dd>{image.status ?? "published"}</dd>
                      </div>
                    </dl>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setReplacingId(image.id);
                          replaceInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-burgundy px-4 py-2 text-sm font-bold text-white transition hover:bg-forest"
                      >
                        <Upload className="h-4 w-4" /> Replace
                      </button>
                      <button
                        onClick={() => setEditing(image)}
                        className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-bold text-white transition hover:bg-burgundy"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => deleteGallery(image)}
                        className="inline-flex items-center gap-2 rounded-full border border-burgundy px-4 py-2 text-sm font-bold text-burgundy transition hover:bg-burgundy hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
          )}
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={saveGallery} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Edit Gallery Image</p>
                <h2 className="mt-2 font-serif text-4xl text-forest">{editing.title}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-full bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Image
              src={editing.url}
              alt={editing.alt}
              width={editing.width ?? 800}
              height={editing.height ?? 600}
              className="mt-5 h-64 w-full rounded-[1.5rem] object-cover"
              unoptimized={editing.url.startsWith("/api/uploads/") || editing.url.startsWith("/uploads/") || editing.url.startsWith("/api/media/file/") || editing.url.startsWith("data:image/")}
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <MediaInput name="title" label="Title" defaultValue={editing.title} required />
              <MediaInput name="alt" label="Alt Text" defaultValue={editing.alt} required />
              <MediaInput name="caption" label="Caption" defaultValue={editing.caption ?? ""} wide />
              <MediaInput name="tags" label="Tags" defaultValue={(editing.tags ?? []).join(", ")} />
              <MediaInput name="order" label="Display Order" type="number" defaultValue={String(editing.order ?? 0)} />
              <label className="block text-sm font-bold text-ink/70">
                Status
                <select name="status" defaultValue={editing.status ?? "published"} className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3">
                  <option value="published">published</option>
                  <option value="hidden">hidden</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
                <Save className="h-4 w-4" /> Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-forest/20 px-5 py-3 font-bold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}

// Pages Media Library - manages page-specific images
export function PagesMediaLibrary({ initialItems }: { initialItems: ImageAsset[] }) {
  const [items, setItems] = useState<ImageAsset[]>(initialItems);
  const [editing, setEditing] = useState<ImageAsset | null>(null);
  const [status, setStatus] = useState("");
  const [selectedPage, setSelectedPage] = useState<string>("all");

  const pages = ["home", "about", "services", "pricing", "gallery", "shop", "testimonials", "blog", "contact", "team"];
  const filteredItems = selectedPage === "all" ? items : items.filter(item => item.page === selectedPage);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Uploading...");
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const raw = formData.get("file");
      if (!(raw instanceof File) || !raw.size) {
        setStatus("Choose an image file first.");
        return;
      }
      formData.set("file", await prepareUploadPng(raw));
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await readUploadResponse(response);
      if (response.ok) {
        setItems([data.asset as ImageAsset, ...items]);
        setStatus(data.message ? `Uploaded as PNG. ${String(data.message)}` : "Uploaded and saved as PNG.");
        try {
          form.reset();
        } catch {
          // Form may unmount during re-render after upload.
        }
      } else {
        setStatus(String(data.error ?? "Upload failed."));
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  async function saveMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setStatus("Saving...");
    const form = new FormData(event.currentTarget);
    const next: ImageAsset = {
      ...editing,
      title: String(form.get("title") ?? editing.title),
      alt: String(form.get("alt") ?? editing.alt),
      caption: String(form.get("caption") ?? ""),
      page: String(form.get("page") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: String(form.get("status") ?? "published") as ImageAsset["status"],
    };
    const response = await fetch("/api/admin/content/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (response.ok) {
      setItems((current) => current.map((image) => (image.id === next.id ? next : image)));
      setEditing(null);
      setStatus("Image updated.");
    } else {
      setStatus("Unable to update image.");
    }
  }

  async function deleteMedia(image: ImageAsset) {
    if (!window.confirm(`Delete "${image.title}"?`)) return;
    setStatus("Deleting...");
    const response = await fetch("/api/admin/content/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image.id }),
    });
    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== image.id));
      setStatus("Image deleted.");
    } else {
      setStatus("Unable to delete image.");
    }
  }

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Pages Media Library</p>
        <h1 className="mt-3 font-serif text-6xl text-forest">Page-specific image management.</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink/65">Upload and manage images for specific pages. Assign images to pages for better organization.</p>
      </div>

      <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5">
        <label className="block text-sm font-bold text-ink/70">
          Filter by Page
          <select 
            value={selectedPage} 
            onChange={(e) => setSelectedPage(e.target.value)}
            className="mt-2 w-full max-w-xs rounded-2xl border border-forest/15 bg-cream px-4 py-3"
          >
            <option value="all">All Pages ({items.length})</option>
            {pages.map(page => {
              const count = items.filter(item => item.page === page).length;
              return (
                <option key={page} value={page}>
                  {page.charAt(0).toUpperCase() + page.slice(1)} ({count})
                </option>
              );
            })}
            <option value="">Unassigned ({items.filter(item => !item.page).length})</option>
          </select>
        </label>
      </div>
      
      <form onSubmit={upload} className="mt-6 grid gap-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-3">
        <input name="file" type="file" accept="image/*,video/*" required className="rounded-2xl bg-cream p-3" />
        <input name="title" placeholder="Image title" required className="rounded-2xl bg-cream px-4 py-3" />
        <input name="alt" placeholder="Alt text" required className="rounded-2xl bg-cream px-4 py-3" />
        <input name="caption" placeholder="Caption" className="rounded-2xl bg-cream px-4 py-3" />
        <select name="page" className="rounded-2xl bg-cream px-4 py-3">
          <option value="">Select page</option>
          {pages.map(page => (
            <option key={page} value={page}>{page.charAt(0).toUpperCase() + page.slice(1)}</option>
          ))}
        </select>
        <input name="tags" placeholder="Tags (comma separated)" className="rounded-2xl bg-cream px-4 py-3" />
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white md:col-span-3">
          <Upload className="h-4 w-4" /> Upload Image
        </button>
        {status ? <p className="md:col-span-3 text-sm text-burgundy">{status}</p> : null}
      </form>
      
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 rounded-[2rem] bg-white p-8 text-center text-ink/60">
            {selectedPage === "all" ? "No images yet." : `No images for ${selectedPage} page.`}
          </div>
        ) : (
          filteredItems.filter(image => image && image.url).map((image) => (
            <article key={image.id} className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5">
              <Image src={image.url} alt={image.alt || "Page image"} width={image.width ?? 800} height={image.height ?? 600} className="h-64 w-full object-cover" />
              <div className="p-5">
                <h2 className="font-serif text-3xl text-forest">{image.title || "Untitled"}</h2>
                <dl className="mt-4 grid gap-2 text-sm text-ink/65">
                  <div><dt className="font-bold text-ink">Alt</dt><dd>{image.alt || "No alt text"}</dd></div>
                  <div><dt className="font-bold text-ink">Page</dt><dd>{image.page || "Unassigned"}</dd></div>
                  <div><dt className="font-bold text-ink">Tags</dt><dd>{image.tags?.join(", ") || "None"}</dd></div>
                  <div><dt className="font-bold text-ink">Status</dt><dd>{image.status ?? "published"}</dd></div>
                </dl>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setEditing(image)} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-bold text-white transition hover:bg-burgundy">
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => deleteMedia(image)} className="inline-flex items-center gap-2 rounded-full border border-burgundy px-4 py-2 text-sm font-bold text-burgundy transition hover:bg-burgundy hover:text-white">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={saveMedia} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Edit Page Image</p>
                <h2 className="mt-2 font-serif text-4xl text-forest">{editing.title}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-full bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Image src={editing.url} alt={editing.alt} width={editing.width ?? 800} height={editing.height ?? 600} className="mt-5 h-64 w-full rounded-[1.5rem] object-cover" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <MediaInput name="title" label="Title" defaultValue={editing.title} required />
              <MediaInput name="alt" label="Alt Text" defaultValue={editing.alt} required />
              <MediaInput name="caption" label="Caption" defaultValue={editing.caption ?? ""} wide />
              <label className="block text-sm font-bold text-ink/70">
                Assigned Page
                <select name="page" defaultValue={editing.page ?? ""} className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3">
                  <option value="">Unassigned</option>
                  {pages.map(page => (
                    <option key={page} value={page}>{page.charAt(0).toUpperCase() + page.slice(1)}</option>
                  ))}
                </select>
              </label>
              <MediaInput name="tags" label="Tags" defaultValue={(editing.tags ?? []).join(", ")} />
              <label className="block text-sm font-bold text-ink/70">
                Status
                <select name="status" defaultValue={editing.status ?? "published"} className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3">
                  <option value="published">published</option>
                  <option value="hidden">hidden</option>
                  <option value="draft">draft</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 font-bold text-white transition hover:bg-burgundy">
                <Save className="h-4 w-4" /> Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-forest/20 px-5 py-3 font-bold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}

function MediaInput({ name, label, defaultValue, type = "text", required, wide }: { name: string; label: string; defaultValue: string; type?: string; required?: boolean; wide?: boolean }) {
  return (
    <label className={cx("block text-sm font-bold text-ink/70", wide && "md:col-span-2")}>
      {label}
      <input name={name} type={type} defaultValue={defaultValue} required={required} className="mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3" />
    </label>
  );
}

type BookingWithId = BookingRequest & { _id?: string; createdAt?: string };

export function BookingsManager({ initialItems }: { initialItems: BookingWithId[] }) {
  const [items, setItems] = useState(initialItems);
  const statuses = ["New", "Awaiting Review", "Awaiting Payment", "Confirmed", "In Progress", "Completed", "Cancelled", "Declined"];

  async function updateStatus(id: string | undefined, status: string) {
    if (!id) return;
    const response = await fetch("/api/admin/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok) {
      setItems((current) => current.map((item) => (item._id === id ? { ...item, status: status as BookingRequest["status"] } : item)));
    }
  }

  return (
    <AdminShell>
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-black/5">
        <p className="text-sm uppercase tracking-[0.3em] text-burgundy">Booking Queue</p>
        <h1 className="mt-3 font-serif text-6xl text-forest">Requests, statuses and care notes.</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ink/65">Every public booking submission appears here with customer details, pet information and status tracking.</p>
      </div>
      <div className="mt-6 grid gap-5">
        {items.length ? items.map((booking) => (
          <article key={booking._id ?? `${booking.email}-${booking.petName}`} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy">{booking.service}</p>
                <h2 className="mt-2 font-serif text-4xl text-forest">{booking.petName} for {booking.customerName}</h2>
                <p className="mt-2 text-sm text-ink/60">{booking.email} • {booking.phone}</p>
              </div>
              <select value={booking.status ?? "New"} onChange={(event) => updateStatus(booking._id, event.target.value)} className="rounded-full bg-sage px-4 py-3 text-sm font-bold">
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div className="mt-6 grid gap-4 text-sm text-ink/70 md:grid-cols-3">
              <Info label="Preferred" value={`${booking.preferredDate} ${booking.preferredTime}`} />
              <Info label="Pet details" value={[booking.petType, booking.breed, booking.age, booking.weight].filter(Boolean).join(" • ")} />
              <Info label="Temperament" value={booking.temperament ?? "Not provided"} />
              <Info label="Medical" value={booking.medicalDetails ?? "Not provided"} />
              <Info label="Feeding" value={booking.feedingInstructions ?? "Not provided"} />
              <Info label="Notes" value={booking.notes ?? "None"} />
            </div>
          </article>
        )) : (
          <div className="rounded-[2rem] bg-white p-8 text-ink/65 shadow-xl shadow-black/5">No booking requests yet.</div>
        )}
      </div>
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream p-4">
      <p className="font-bold text-ink">{label}</p>
      <p className="mt-1 leading-6">{value || "Not provided"}</p>
    </div>
  );
}
