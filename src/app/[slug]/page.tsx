import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardPage } from "@/components/site";
import {
  BlogPost,
  Faq,
  PageContent,
  TeamMember,
  Testimonial,
  blogPosts,
  faqs,
  getCollection,
  getPage,
  getPricingPackages,
  getProducts,
  getServices,
  pages,
  team,
  testimonials,
} from "@/lib/site";

export async function generateStaticParams() {
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  const ogImage = page.hero?.images?.[0]?.url;

  return {
    title: page.seoTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.seoTitle,
      description: page.metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  // Keep CMS/seed page content as-is; only pricing packages use the confirmed package list.
  const [services, pricing, allFaqs, reviews, posts, shopProducts, teamMembers] = await Promise.all([
    getServices(),
    slug === "pricing" ? getPricingPackages() : Promise.resolve([]),
    getCollection<Faq>("faqs", faqs),
    getCollection<Testimonial>("testimonials", testimonials),
    getCollection<BlogPost>("blog", blogPosts),
    getProducts(),
    getCollection<TeamMember>("team", team),
  ]);

  return (
    <StandardPage
      page={page as PageContent}
      services={services}
      pricing={pricing}
      faqs={allFaqs}
      testimonials={reviews}
      blogPosts={posts}
      products={shopProducts}
      team={teamMembers}
    />
  );
}
