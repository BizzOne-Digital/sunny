export const dynamic = "force-dynamic";

import { HomePage } from "@/components/site";
import { getPage, getProducts, getServices, getTestimonials } from "@/lib/site";

export default async function Home() {
  const [page, services, reviews, shopProducts] = await Promise.all([
    getPage("home"),
    getServices(),
    getTestimonials(),
    getProducts(),
  ]);

  return <HomePage page={page} services={services} testimonials={reviews} products={shopProducts} />;
}
