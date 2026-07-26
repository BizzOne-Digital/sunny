import { redirect } from "next/navigation";
import { GalleryManager } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { getGalleryImagesForAdmin, syncGalleryImages } from "@/lib/site";

export const metadata = {
  title: "Gallery Management",
};

export default async function AdminGalleryPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  await syncGalleryImages();
  const items = await getGalleryImagesForAdmin();

  return <GalleryManager initialItems={items} />;
}
