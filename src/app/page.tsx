import { HomePage } from "@/components/site";
import { getCollection, getProducts, getServices, testimonials, Testimonial } from "@/lib/site";

export default async function Home() {
  const [services, reviews, shopProducts] = await Promise.all([
    getServices(),
    getCollection<Testimonial>("testimonials", testimonials),
    getProducts(),
  ]);

  return <HomePage services={services} testimonials={reviews} products={shopProducts} />;
}
