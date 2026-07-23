import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardPage } from "@/components/site";
import {
  BlogPost,
  Faq,
  PageContent,
  TeamMember,
  blogPosts,
  faqs,
  getCollection,
  getFaqs,
  getPage,
  getPricingPackages,
  getProducts,
  getServices,
  getTeamMembers,
  getTestimonials,
  getTreatImages,
  pages,
  team,
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
  const [services, pricing, allFaqs, reviews, posts, shopProducts, teamMembers, treatImages] = await Promise.all([
    getServices(),
    slug === "pricing" ? getPricingPackages() : Promise.resolve([]),
    getFaqs(),
    getTestimonials(),
    getCollection<BlogPost>("blog", blogPosts),
    getProducts(),
    getTeamMembers(),
    slug === "treats" ? getTreatImages() : Promise.resolve([]),
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
      treatImages={treatImages}
    />
  );
}
