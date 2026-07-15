import { redirect } from "next/navigation";
import { BookingsManager } from "@/components/admin";
import { getAdminSession } from "@/lib/auth";
import { connectMongo, Models } from "@/lib/site";

export const metadata = {
  title: "Bookings",
};

export default async function AdminBookingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let bookings = [];
  if (await connectMongo()) {
    bookings = JSON.parse(JSON.stringify(await Models.Booking().find({}).sort({ createdAt: -1 }).lean()));
  }

  return <BookingsManager initialItems={bookings} />;
}
