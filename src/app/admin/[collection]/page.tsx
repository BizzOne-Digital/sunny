import { redirect } from "next/navigation";
import { ContentManager } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { CollectionName, collectionDefaults, collectionModelMap, getCollection } from "@/lib/site";

export async function generateStaticParams() {
  return Object.keys(collectionModelMap)
    .filter((collection) => !["media"].includes(collection))
    .map((collection) => ({ collection }));
}

export default async function AdminCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { collection: rawCollection } = await params;
  const collection = rawCollection as CollectionName;
  if (!collectionModelMap[collection] || collection === "media") redirect("/admin");

  const fallback = collectionDefaults[collection] as unknown[];
  const items = await getCollection(collection, fallback);

  return <ContentManager collection={collection} initialItems={items} />;
}
