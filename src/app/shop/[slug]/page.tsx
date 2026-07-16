import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductDetail } from "@/components/site";
import { getProducts, products } from "@/lib/site";

const productAliases: Record<string, string> = {
  "dog-mom-long-sleeve-shirt": "dog-mom-merch",
  "dog-dad-long-sleeve-shirt": "dog-dad-merch",
};

export async function generateStaticParams() {
  return [
    ...products.map((product) => ({ slug: product.slug })),
    ...Object.keys(productAliases).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSlug = productAliases[slug] ?? slug;
  const allProducts = await getProducts();
  const product = allProducts.find((item) => item.slug === resolvedSlug);
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
  if (productAliases[slug]) redirect(`/shop/${productAliases[slug]}`);

  const allProducts = await getProducts();
  const product = allProducts.find((item) => item.slug === slug && item.status !== "draft");
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
