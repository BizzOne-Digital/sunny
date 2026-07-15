import { redirect } from "next/navigation";
import { ContentManager } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { getCollection, PageContent, pages } from "@/lib/site";

export default async function AdminPoliciesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const allPages = await getCollection<PageContent>("pages", pages);
  const policyPages = allPages.filter((page) => ["privacy", "privacy-policy", "terms", "cancellation-policy", "refund-return-policy"].includes(page.slug));

  return <ContentManager collection="pages" initialItems={policyPages} />;
}
