import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getSiteBrand, saveSiteBrand } from "@/lib/site";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const brand = await getSiteBrand();
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load brand logos." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const brand = await saveSiteBrand({
      headerLogo: typeof body.headerLogo === "string" ? body.headerLogo : undefined,
      footerLogo: typeof body.footerLogo === "string" ? body.footerLogo : undefined,
      introLogo: typeof body.introLogo === "string" ? body.introLogo : undefined,
    });
    revalidatePath("/", "layout");
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save brand logos." },
      { status: 500 },
    );
  }
}
