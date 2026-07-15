import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/site";
import { Product, getCollection, products } from "@/lib/site";

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const allProducts = await getCollection<Product>("products", products);
  const product = allProducts.find((item) => item.slug === slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allProducts = await getCollection<Product>("products", products);
  const product = allProducts.find((item) => item.slug === slug && item.status !== "draft");
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
