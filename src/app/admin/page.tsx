import { redirect } from "next/navigation";
import { Dashboard } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { collectionDefaults, connectMongo, Models } from "@/lib/site";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let bookingCount = 0;
  let pendingBookings = 0;

  if (await connectMongo()) {
    const Booking = Models.Booking();
    bookingCount = await Booking.countDocuments();
    pendingBookings = await Booking.countDocuments({ status: { $in: ["New", "Awaiting Review", "Awaiting Payment", "Pending", "Contacted"] } });
  }

  const stats = [
    { label: "New / Pending bookings", value: pendingBookings },
    { label: "Total bookings", value: bookingCount },
    { label: "Published services", value: collectionDefaults.services.filter((item) => item.status !== "draft").length },
    { label: "Gallery images", value: collectionDefaults.media.length },
    { label: "Products", value: collectionDefaults.products.length },
    { label: "Blog posts", value: collectionDefaults.blog.length },
  ];

  return <Dashboard stats={stats} />;
}
