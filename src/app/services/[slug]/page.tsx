import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/site";
import { getService, getServices, services } from "@/lib/site";

const serviceAliases: Record<string, string> = {
  "dog-walking": "dog-walking-1-hour",
  "pet-visits": "pet-visit",
  "house-sitting": "house-sitting-one-night",
  daycare: "dog-half-daycare",
  "dog-daycare": "dog-half-daycare",
  boarding: "dog-boarding-one-night",
  "dog-boarding": "dog-boarding-one-night",
  grooming: "dog-grooming",
  "dog-grooming": "dog-grooming",
  "nail-trimming": "bath-and-nails",
  training: "training-and-classes",
  "guided-excursions": "guided-pet-excursion",
  "pet-chauffeur": "meet-and-greet",
};

function normalizeServiceSlug(slug: string) {
  return serviceAliases[slug] ?? slug;
}

export async function generateStaticParams() {
  return [...services.map((service) => ({ slug: service.slug })), ...Object.keys(serviceAliases).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(normalizeServiceSlug(slug));
  if (!service) return {};

  return {
    title: `${service.name} | Premium Pet Care GTA`,
    description: service.summary,
    openGraph: {
      title: `${service.name} by DTdogs.ca`,
      description: service.summary,
      images: service.images[0]?.url ? [service.images[0].url] : undefined,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(normalizeServiceSlug(slug));
  if (!service) notFound();

  const allServices = await getServices();
  const related = allServices.filter((item) => service.related.includes(item.slug)).slice(0, 3);

  return <ServiceDetail service={service} related={related} />;
}
