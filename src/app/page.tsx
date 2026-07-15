import { HomePage } from "@/components/site";
import { getCollection, getServices, products, Product, testimonials, Testimonial } from "@/lib/site";

export default async function Home() {
  const [services, reviews, shopProducts] = await Promise.all([
    getServices(),
    getCollection<Testimonial>("testimonials", testimonials),
    getCollection<Product>("products", products),
  ]);

  return <HomePage services={services} testimonials={reviews} products={shopProducts} />;
}
