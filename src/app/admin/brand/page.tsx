import { redirect } from "next/navigation";
import { BrandLogosManager } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { getSiteBrand } from "@/lib/site";

export const metadata = {
  title: "Brand Logos",
};

export default async function AdminBrandPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const brand = await getSiteBrand();
  return <BrandLogosManager initialBrand={brand} />;
}
