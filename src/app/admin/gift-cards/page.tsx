import { redirect } from "next/navigation";
import { ContentManager } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { getCollection, Product, products } from "@/lib/site";

export default async function AdminGiftCardsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const allProducts = await getCollection<Product>("products", products);
  const giftCards = allProducts.filter((product) => product.slug.includes("gift-card"));

  return <ContentManager collection="products" initialItems={giftCards} />;
}
