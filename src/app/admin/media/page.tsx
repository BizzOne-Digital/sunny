import { redirect } from "next/navigation";
import { MediaLibrary } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { getCollection, ImageAsset, mediaLibrary } from "@/lib/site";

export const metadata = {
  title: "Media Library",
};

export default async function AdminMediaPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const media = await getCollection<ImageAsset>("media", mediaLibrary);
  return <MediaLibrary initialItems={media} />;
}
