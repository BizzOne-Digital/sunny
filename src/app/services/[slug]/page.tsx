export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ServiceDetail } from "@/components/site";
import { getService, getServices } from "@/lib/site";

const serviceAliases: Record<string, string> = {
  "dog-walking-1-hour": "dog-walking",
  "dog-walking-30-minutes": "dog-walking",
  "dog-grooming": "grooming",
  "bath-and-nails": "nail-trim",
  "bath-and-tidy": "grooming",
  "full-haircut": "grooming",
  "nail-trimming": "nail-trim",
  "dog-half-daycare": "daycare",
  "dog-daycare": "daycare",
  "dog-boarding-one-night": "boarding",
  "dog-boarding": "boarding",
  "training-and-classes": "behaviour-training",
  training: "behaviour-training",
  "meet-and-greet": "dog-walking",
  "pet-visit": "dog-walking",
  "pet-visits": "dog-walking",
  "house-sitting": "boarding",
  "house-sitting-one-night": "boarding",
  "house-sitting-full-day": "boarding",
  "house-sitting-half-day": "boarding",
  "guided-pet-excursion": "dog-walking",
  "guided-excursions": "dog-walking",
  "pet-chauffeur": "dog-walking",
};

function normalizeServiceSlug(slug: string) {
  return serviceAliases[slug] ?? slug;
}

export async function generateStaticParams() {
  const allServices = await getServices();
  return [...allServices.map((service) => ({ slug: service.slug })), ...Object.keys(serviceAliases).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(normalizeServiceSlug(slug));
  if (!service) return {};

  return {
    title: `${service.name} | Premium Pet Care GTA`,
    description: service.description,
    openGraph: {
      title: `${service.name} by DTdogs.ca`,
      description: service.description,
      images: service.images?.[0]?.url ? [service.images[0].url] : undefined,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = normalizeServiceSlug(slug);
  if (serviceAliases[slug]) redirect(`/services/${resolved}`);

  const service = await getService(resolved);
  if (!service) notFound();

  const allServices = await getServices();
  const related = allServices.filter((item) => service.related.includes(item.slug)).slice(0, 3);

  return <ServiceDetail service={service} related={related} />;
}
