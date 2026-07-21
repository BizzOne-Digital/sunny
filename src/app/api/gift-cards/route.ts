import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo, Models } from "@/lib/site";

const giftCardSchema = z.object({
  denomination: z.literal("CAD $150"),
  quantity: z.coerce.number().int().min(1).max(50),
  recipientName: z.string().min(2),
  recipientEmail: z.string().email(),
  senderName: z.string().min(2),
  senderEmail: z.string().email(),
  message: z.string().optional(),
  deliveryDate: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = giftCardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the required gift card fields." }, { status: 400 });
  }

  if (!(await connectMongo())) {
    return NextResponse.json({ error: "MONGODB_URI is required for gift card requests." }, { status: 500 });
  }

  await Models.GiftCardOrder().create({
    ...parsed.data,
    paymentStatus: "Payment Pending",
    status: "New",
  });

  return NextResponse.json({ ok: true });
}
