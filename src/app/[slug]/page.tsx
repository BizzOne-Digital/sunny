import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardPage } from "@/components/site";
import {
  BlogPost,
  Faq,
  PageContent,
  PricingPackage,
  Product,
  TeamMember,
  Testimonial,
  blogPosts,
  faqs,
  getCollection,
  getPage,
  getServices,
  pages,
  pricingPackages,
  products,
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

  return {
    title: page.seoTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.seoTitle,
      description: page.metaDescription,
      images: page.hero.images[0]?.url ? [page.hero.images[0].url] : undefined,
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  const [services, pricing, allFaqs, reviews, posts, shopProducts, teamMembers] = await Promise.all([
    getServices(),
    getCollection<PricingPackage>("pricing", pricingPackages),
    getCollection<Faq>("faqs", faqs),
    getCollection<Testimonial>("testimonials", testimonials),
    getCollection<BlogPost>("blog", blogPosts),
    getCollection<Product>("products", products),
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
