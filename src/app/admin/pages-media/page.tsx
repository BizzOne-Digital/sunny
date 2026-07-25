import { redirect } from "next/navigation";
import { PagesMediaLibrary } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { getCollection, ImageAsset, mediaLibrary } from "@/lib/site";

export const metadata = {
  title: "Pages Media Library",
};

export default async function AdminPagesMediaPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const media = await getCollection<ImageAsset>("media", mediaLibrary);
  return <PagesMediaLibrary initialItems={media} />;
}
