import type { Metadata } from "next";
import { StandardPage } from "@/components/site";
import { getPage, getTreatImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dog Treats | DTdogs.ca",
  description: "A warm editorial gallery for DTdogs dog treats, product details and treat photography.",
};

export default async function TreatsPage() {
  const page = await getPage("treats");
  const treatImages = await getTreatImages();
  
  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <StandardPage
      page={page}
      services={[]}
      pricing={[]}
      faqs={[]}
      testimonials={[]}
      blogPosts={[]}
      products={[]}
      team={[]}
      treatImages={treatImages}
    />
  );
}
