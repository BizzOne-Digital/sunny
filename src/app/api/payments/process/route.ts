import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import {
  PAYMENT_METHODS,
  createPaymentReference,
  detectCardBrand,
  digitsOnly,
  isExpiryValid,
  luhnCheck,
  parseAmountToCents,
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
  storeBitcoinConfirmed: z.boolean().optional(),
  giftCardCode: z.string().optional(),
  paymentNote: z.string().optional(),
});

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

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
      const stripe = getStripe();
      if (!stripe) {
        return NextResponse.json(
          { error: "Card payments are not configured yet. Missing Stripe secret key." },
          { status: 503 },
        );
      }

      const amountCents = parseAmountToCents(data.amountLabel);
      if (!amountCents) {
        return NextResponse.json(
          { error: "This booking total cannot be charged online yet. Please choose Interac or pay at the store." },
          { status: 400 },
        );
      }

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

      const exp = digitsOnly(cardExpiry);
      const expMonth = Number(exp.slice(0, 2));
      const expYear = 2000 + Number(exp.slice(2, 4));

      try {
        const paymentMethod = await stripe.paymentMethods.create({
          type: "card",
          card: {
            number: cardNumber,
            exp_month: expMonth,
            exp_year: expYear,
            cvc: cardCvc,
          },
          billing_details: { name: cardName },
        });

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountCents,
          currency: "cad",
          confirm: true,
          payment_method: paymentMethod.id,
          payment_method_types: ["card"],
          metadata: {
            method: data.method,
            amountLabel: data.amountLabel,
            note: (data.paymentNote || "").slice(0, 400),
          },
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dtdogs.ca"}/booking`,
        });

        if (paymentIntent.status !== "succeeded" && paymentIntent.status !== "requires_capture") {
          return NextResponse.json(
            {
              error:
                paymentIntent.status === "requires_action"
                  ? "This card requires extra authentication. Please use Interac or another card, or share the Stripe Publishable Key so we can enable 3D Secure."
                  : `Card payment status: ${paymentIntent.status}. Please try another method.`,
            },
            { status: 402 },
          );
        }

        return NextResponse.json({
          ok: true,
          paymentStatus: "Paid",
          paymentMethod: data.method,
          paymentReference: paymentIntent.id,
          last4: cardNumber.slice(-4),
          amountLabel: data.amountLabel,
          message: `${methodMeta.label} payment authorized via Stripe.`,
        });
      } catch (stripeError) {
        const message =
          stripeError instanceof Error ? stripeError.message : "Stripe could not charge this card.";
        console.error("Stripe card charge failed:", stripeError);
        return NextResponse.json({ error: message }, { status: 402 });
      }
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
      if (!data.storeBitcoinConfirmed) {
        return NextResponse.json(
          { error: "Confirm you will complete Bitcoin payment in person at the store." },
          { status: 400 },
        );
      }
      return NextResponse.json({
        ok: true,
        paymentStatus: "Deposit Pending",
        paymentMethod: data.method,
        paymentReference: createPaymentReference(data.method as PaymentMethodId),
        amountLabel: data.amountLabel,
        message: "Bitcoin payment will be completed in store.",
      });
    }

    const giftCode = (data.giftCardCode || "").trim().toUpperCase();
    if (!/^[A-Z0-9-]{6,32}$/.test(giftCode)) {
      return NextResponse.json(
        { error: "Enter a valid Clover / DTdogs gift card code (full amount only)." },
        { status: 400 },
      );
    }
    return NextResponse.json({
      ok: true,
      paymentStatus: "Paid",
      paymentMethod: data.method,
      paymentReference: `GIFT-${giftCode}`,
      giftCardCode: giftCode,
      amountLabel: data.amountLabel,
      message: "Gift card payment applied (full amount).",
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json({ error: "Unable to process payment. Please try again." }, { status: 500 });
  }
}
