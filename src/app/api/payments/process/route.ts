import { NextResponse } from "next/server";
import { z } from "zod";
import {
  PAYMENT_METHODS,
  createPaymentReference,
  detectCardBrand,
  digitsOnly,
  isExpiryValid,
  luhnCheck,
  type PaymentMethodId,
} from "@/lib/payment";

const schema = z.object({
  method: z.enum(["visa", "mastercard", "amex", "interac", "bitcoin", "gift"]),
  amountLabel: z.string().min(1),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  interacReference: z.string().optional(),
  interacConfirmed: z.boolean().optional(),
  bitcoinTxId: z.string().optional(),
  giftCardCode: z.string().optional(),
  paymentNote: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment request." }, { status: 400 });
  }

  const data = parsed.data;
  const methodMeta = PAYMENT_METHODS.find((item) => item.id === data.method);
  if (!methodMeta) {
    return NextResponse.json({ error: "Unsupported payment method." }, { status: 400 });
  }

  try {
    if (methodMeta.kind === "card") {
      const cardName = (data.cardName || "").trim();
      const cardNumber = digitsOnly(data.cardNumber || "");
      const cardExpiry = data.cardExpiry || "";
      const cardCvc = digitsOnly(data.cardCvc || "");

      if (cardName.length < 2) {
        return NextResponse.json({ error: "Enter the name on the card." }, { status: 400 });
      }
      if (!luhnCheck(cardNumber)) {
        return NextResponse.json({ error: "Enter a valid card number." }, { status: 400 });
      }
      const brand = detectCardBrand(cardNumber);
      if (brand && brand !== data.method) {
        return NextResponse.json(
          { error: `This card looks like ${brand}. Please select ${brand} or use a matching card.` },
          { status: 400 },
        );
      }
      if (data.method === "amex" && cardNumber.length !== 15) {
        return NextResponse.json({ error: "Amex cards must be 15 digits." }, { status: 400 });
      }
      if (data.method !== "amex" && cardNumber.length !== 16) {
        return NextResponse.json({ error: "Card number must be 16 digits." }, { status: 400 });
      }
      if (!isExpiryValid(cardExpiry)) {
        return NextResponse.json({ error: "Enter a valid expiry (MM/YY)." }, { status: 400 });
      }
      const cvcLen = data.method === "amex" ? 4 : 3;
      if (cardCvc.length !== cvcLen) {
        return NextResponse.json({ error: `Enter a ${cvcLen}-digit security code.` }, { status: 400 });
      }

      // Card details are validated and discarded — only a reference + last4 are returned.
      return NextResponse.json({
        ok: true,
        paymentStatus: "Paid",
        paymentMethod: data.method,
        paymentReference: createPaymentReference(data.method as PaymentMethodId),
        last4: cardNumber.slice(-4),
        amountLabel: data.amountLabel,
        message: `${methodMeta.label} payment authorized.`,
      });
    }

    if (methodMeta.kind === "interac") {
      const reference = (data.interacReference || "").trim();
      if (reference.length < 4) {
        return NextResponse.json({ error: "Enter your Interac e-Transfer reference." }, { status: 400 });
      }
      if (!data.interacConfirmed) {
        return NextResponse.json({ error: "Confirm that you sent the Interac e-Transfer." }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        paymentStatus: "Paid",
        paymentMethod: data.method,
        paymentReference: `INTERAC-${reference.toUpperCase().replace(/\s+/g, "")}`,
        amountLabel: data.amountLabel,
        message: "Interac payment recorded.",
      });
    }

    if (methodMeta.kind === "bitcoin") {
      const txId = (data.bitcoinTxId || "").trim();
      if (txId.length < 8) {
        return NextResponse.json({ error: "Enter a valid Bitcoin transaction ID." }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        paymentStatus: "Paid",
        paymentMethod: data.method,
        paymentReference: `BTC-${txId.slice(0, 16).toUpperCase()}`,
        amountLabel: data.amountLabel,
        message: "Bitcoin payment recorded.",
      });
    }

    const giftCode = (data.giftCardCode || "").trim().toUpperCase();
    if (!/^[A-Z0-9-]{6,32}$/.test(giftCode)) {
      return NextResponse.json({ error: "Enter a valid DTdogs gift card code." }, { status: 400 });
    }
    return NextResponse.json({
      ok: true,
      paymentStatus: "Paid",
      paymentMethod: data.method,
      paymentReference: `GIFT-${giftCode}`,
      giftCardCode: giftCode,
      amountLabel: data.amountLabel,
      message: "Gift card payment applied.",
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json({ error: "Unable to process payment. Please try again." }, { status: 500 });
  }
}
