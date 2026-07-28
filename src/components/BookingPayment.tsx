"use client";

import { useState } from "react";
import { Check, Lock, MapPin } from "lucide-react";
import {
  PAYMENT_METHODS,
  formatCardNumber,
  formatExpiry,
  type PaymentMethodId,
} from "@/lib/payment";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type BookingPaymentResult = {
  paymentMethod: PaymentMethodId;
  paymentReference: string;
  paymentStatus: "Paid" | "Deposit Pending";
  giftCardCode?: string;
  last4?: string;
};

type BookingPaymentCheckoutProps = {
  amountLabel: string;
  paid: boolean;
  result: BookingPaymentResult | null;
  onPaid: (result: BookingPaymentResult) => void;
  interacEmail?: string;
  interacAutodepositName?: string;
};

export function BookingPaymentCheckout({
  amountLabel,
  paid,
  result,
  onPaid,
  interacEmail = "connect@dtdogs.ca",
  interacAutodepositName = "Khushwant Haresh Motiani or DTdogs.ca",
}: BookingPaymentCheckoutProps) {
  const [method, setMethod] = useState<PaymentMethodId | "">(result?.paymentMethod ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [interacReference, setInteracReference] = useState("");
  const [interacConfirmed, setInteracConfirmed] = useState(false);
  const [storeBitcoinConfirmed, setStoreBitcoinConfirmed] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  const selected = PAYMENT_METHODS.find((item) => item.id === method);

  async function pay() {
    if (!method) {
      setError("Select a payment method.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          amountLabel,
          cardName,
          cardNumber,
          cardExpiry,
          cardCvc,
          interacReference,
          interacConfirmed,
          storeBitcoinConfirmed,
          giftCardCode,
          paymentNote,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Payment failed. Please try again.");
        return;
      }
      onPaid({
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
        paymentStatus: data.paymentStatus === "Deposit Pending" ? "Deposit Pending" : "Paid",
        giftCardCode: data.giftCardCode,
        last4: data.last4,
      });
    } catch {
      setError("Unable to reach payment service. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (paid && result) {
    return (
      <div className="rounded-[1.5rem] border border-forest/15 bg-white p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-white">
            <Check className="h-5 w-5" />
          </span>
          <div>
            <p className="font-serif text-2xl text-forest">
              {result.paymentStatus === "Deposit Pending" ? "Store payment arranged" : "Payment received"}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink/65">
              {PAYMENT_METHODS.find((item) => item.id === result.paymentMethod)?.label ?? "Payment"} · {amountLabel}
              {result.last4 ? ` · **** ${result.last4}` : ""}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-burgundy">
              Ref {result.paymentReference}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none ring-forest/20 focus:ring-4";

  const payLabel =
    selected?.kind === "bitcoin"
      ? "Confirm in-store Bitcoin payment"
      : selected?.kind === "gift"
        ? `Apply gift card for ${amountLabel}`
        : `Pay ${amountLabel} now`;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-ink/70">Choose payment method</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PAYMENT_METHODS.map((item) => {
            const active = method === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMethod(item.id);
                  setError("");
                }}
                className={cx(
                  "rounded-2xl border px-3 py-3 text-center transition",
                  active
                    ? "border-transparent bg-forest text-white shadow-lg shadow-forest/20"
                    : "border-forest/15 bg-white text-forest hover:border-coral/50",
                )}
              >
                <span className="block text-sm font-bold tracking-wide">{item.mark}</span>
                <span className={cx("mt-1 block text-[11px]", active ? "text-white/75" : "text-ink/50")}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selected?.kind === "card" ? (
        <div className="grid gap-4 rounded-[1.5rem] border border-forest/10 bg-white p-4 sm:grid-cols-2">
          <p className="text-sm leading-6 text-ink/65 sm:col-span-2">
            Secure card payment via Stripe (CAD). Visa, Mastercard and Amex accepted.
          </p>
          <label className="block text-sm font-bold text-ink/70 sm:col-span-2">
            Name on card
            <input value={cardName} onChange={(e) => setCardName(e.target.value)} className={inputClass} autoComplete="cc-name" />
          </label>
          <label className="block text-sm font-bold text-ink/70 sm:col-span-2">
            Card number
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value, method as PaymentMethodId))}
              className={inputClass}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder={method === "amex" ? "···· ······ ·····" : "···· ···· ···· ····"}
            />
          </label>
          <label className="block text-sm font-bold text-ink/70">
            Expiry
            <input
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
              className={inputClass}
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
            />
          </label>
          <label className="block text-sm font-bold text-ink/70">
            CVC
            <input
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, method === "amex" ? 4 : 3))}
              className={inputClass}
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={method === "amex" ? "····" : "···"}
            />
          </label>
        </div>
      ) : null}

      {selected?.kind === "interac" ? (
        <div className="rounded-[1.5rem] border border-forest/10 bg-white p-4">
          <p className="text-sm leading-7 text-ink/70">
            Send an Interac e-Transfer for <strong>{amountLabel}</strong> to{" "}
            <strong>{interacEmail}</strong>.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Autodeposit name: <strong>{interacAutodepositName}</strong>
          </p>
          <label className="mt-4 block text-sm font-bold text-ink/70">
            Interac reference
            <input value={interacReference} onChange={(e) => setInteracReference(e.target.value)} className={inputClass} placeholder="e.g. ET-123456" />
          </label>
          <label className="mt-4 flex items-start gap-3 text-sm text-ink/70">
            <input type="checkbox" checked={interacConfirmed} onChange={(e) => setInteracConfirmed(e.target.checked)} className="mt-1" />
            I have sent the Interac e-Transfer for this booking.
          </label>
        </div>
      ) : null}

      {selected?.kind === "bitcoin" ? (
        <div className="rounded-[1.5rem] border border-forest/10 bg-white p-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-burgundy" />
            <div>
              <p className="text-sm leading-7 text-ink/70">
                Bitcoin is accepted <strong>in person at the store only</strong>. Online wallet payments are not available.
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                Visit the store to complete a Bitcoin payment of <strong>{amountLabel}</strong>.
              </p>
            </div>
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={storeBitcoinConfirmed}
              onChange={(e) => setStoreBitcoinConfirmed(e.target.checked)}
              className="mt-1"
            />
            I will complete Bitcoin payment in person at the store.
          </label>
        </div>
      ) : null}

      {selected?.kind === "gift" ? (
        <div className="rounded-[1.5rem] border border-forest/10 bg-white p-4">
          <p className="text-sm leading-7 text-ink/70">
            Gift cards are issued through <strong>Clover</strong> by <strong>Sunny and Yazz</strong>.{" "}
            <strong>Full amount only</strong>. For custom payment amounts, contact the store in person.
          </p>
          <label className="mt-4 block text-sm font-bold text-ink/70">
            Clover gift card code
            <input
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
              className={inputClass}
              placeholder="Enter Clover gift card code"
            />
          </label>
        </div>
      ) : null}

      <label className="block text-sm font-bold text-ink/70">
        Payment note (optional)
        <textarea value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} rows={3} className={inputClass} name="paymentNote" />
      </label>

      <input type="hidden" name="giftCardCode" value={giftCardCode || result?.giftCardCode || ""} />

      <button
        type="button"
        onClick={() => void pay()}
        disabled={busy || !method}
        className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Lock className="h-4 w-4" />
        <span className="relative z-10">{busy ? "Processing..." : payLabel}</span>
      </button>

      {error ? <p className="text-sm font-semibold text-burgundy">{error}</p> : null}
    </div>
  );
}
