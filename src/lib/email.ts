import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { BookingRequest } from "@/lib/site";

type MailPayload = {
  to: string;
  subject: string;
  text: string;
};

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function mailFrom() {
  return process.env.EMAIL_FROM ?? `DTdogs.ca <${process.env.SMTP_USER ?? "connect@dtdogs.ca"}>`;
}

async function sendViaSmtp(messages: MailPayload[]) {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await Promise.all(
    messages.map((message) =>
      transporter.sendMail({
        from: mailFrom(),
        to: message.to,
        subject: message.subject,
        text: message.text,
      }),
    ),
  );
}

async function sendViaResend(messages: MailPayload[]) {
  if (!process.env.RESEND_API_KEY) return false;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = mailFrom();
  await Promise.all(
    messages.map((message) =>
      resend.emails.send({
        from,
        to: message.to,
        subject: message.subject,
        text: message.text,
      }),
    ),
  );
  return true;
}

function bookingMailMessages(booking: BookingRequest): MailPayload[] {
  const businessEmail = process.env.BOOKING_NOTIFY_EMAIL ?? "connect@dtdogs.ca";
  const paymentLine = booking.paymentReference
    ? `Payment: ${booking.paymentStatus ?? "Paid"} via ${booking.paymentMethod ?? "n/a"} (${booking.paymentReference})`
    : `Payment: ${booking.paymentStatus ?? "Payment Pending"}`;

  return [
    {
      to: businessEmail,
      subject: `New booking request: ${booking.service}`,
      text: [
        `New booking request from ${booking.customerName}`,
        `Email: ${booking.email}`,
        `Phone: ${booking.phone}`,
        `Service: ${booking.service}`,
        `Preferred: ${booking.preferredDate} ${booking.preferredTime}`,
        `Pet: ${booking.petName} (${booking.petType})`,
        paymentLine,
        `Total: ${booking.estimatedTotal ?? "n/a"}`,
        `Notes: ${booking.notes ?? "None"}`,
      ].join("\n"),
    },
    {
      to: booking.email,
      subject: "We received your DTdogs.ca booking request",
      text: [
        `Hi ${booking.customerName},`,
        "",
        "Thank you for reaching out to DTdogs.ca. We received your booking request and will contact you to confirm availability and next steps.",
        "",
        `Service: ${booking.service}`,
        `Preferred: ${booking.preferredDate} ${booking.preferredTime}`,
        paymentLine,
        "",
        "DTdogs.ca",
        "connect@dtdogs.ca",
      ].join("\n"),
    },
  ];
}

export async function sendBookingEmails(booking: BookingRequest) {
  const messages = bookingMailMessages(booking);

  try {
    if (smtpConfigured()) {
      await sendViaSmtp(messages);
      return { skipped: false, provider: "smtp" as const };
    }

    const sent = await sendViaResend(messages);
    if (sent) return { skipped: false, provider: "resend" as const };

    return { skipped: true, provider: "none" as const };
  } catch (error) {
    console.error("Booking email send failed:", error);
    return { skipped: true, provider: "error" as const, error };
  }
}
