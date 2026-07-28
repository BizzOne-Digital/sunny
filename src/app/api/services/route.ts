import { NextResponse } from "next/server";
import { getServices } from "@/lib/site";

/** Always read live Mongo prices — never serve a build-time snapshot. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Public services list — same Mongo source as booking / service pages. */
export async function GET() {
  try {
    const services = await getServices();
    const published = services.filter(
      (service) => service.status !== "draft" && service.status !== "coming-soon",
    );
    return NextResponse.json(
      { success: true, services: published },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
