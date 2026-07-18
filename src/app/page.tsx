import { HomePage } from "@/components/site";
import { getProducts, getServices, getTestimonials } from "@/lib/site";

export default async function Home() {
  const [services, reviews, shopProducts] = await Promise.all([
    getServices(),
    getTestimonials(),
    getProducts(),
  ]);

  return <HomePage services={services} testimonials={reviews} products={shopProducts} />;
}
