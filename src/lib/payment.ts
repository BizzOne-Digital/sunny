/** Client + server safe payment helpers (no card data persistence). */

export const PAYMENT_METHODS = [
  { id: "visa", label: "Visa", mark: "VISA", kind: "card" as const },
  { id: "mastercard", label: "Mastercard", mark: "MC", kind: "card" as const },
  { id: "amex", label: "Amex", mark: "AMEX", kind: "card" as const },
  { id: "interac", label: "Interac", mark: "Interac", kind: "interac" as const },
  { id: "bitcoin", label: "Bitcoin", mark: "₿", kind: "bitcoin" as const },
  { id: "gift", label: "DTdogs Gift Card", mark: "Gift", kind: "gift" as const },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(value: string, method?: PaymentMethodId) {
  const digits = digitsOnly(value).slice(0, method === "amex" ? 15 : 16);
  if (method === "amex") {
    return digits.replace(/(\d{1,4})(\d{1,6})?(\d{1,5})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function luhnCheck(cardNumber: string) {
  const digits = digitsOnly(cardNumber);
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(cardNumber: string): PaymentMethodId | null {
  const digits = digitsOnly(cardNumber);
  if (/^3[47]/.test(digits)) return "amex";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) return "mastercard";
  if (/^4/.test(digits)) return "visa";
  return null;
}

export function isExpiryValid(expiry: string) {
  const match = digitsOnly(expiry).match(/^(\d{2})(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month, 0, 23, 59, 59);
  return exp >= now;
}

export function createPaymentReference(method: PaymentMethodId) {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DT-${method.slice(0, 3).toUpperCase()}-${stamp}-${rand}`;
}

/** Parse labels like "$30", "CAD $150.00", "From $20", "150 and up" into Stripe cents (CAD). */
export function parseAmountToCents(amountLabel: string): number | null {
  const cleaned = amountLabel.replace(/,/g, "").trim();
  if (!cleaned) return null;
  // Prefer first number so "150 and up" charges 150.00.
  const match = cleaned.match(/(\d+(?:\.\d{1,2})?)/);
  if (!match) return null;
  const dollars = Number(match[1]);
  if (!Number.isFinite(dollars) || dollars <= 0) return null;
  return Math.round(dollars * 100);
}
