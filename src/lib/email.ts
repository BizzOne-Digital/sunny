import { Resend } from "resend";
import type { BookingRequest } from "@/lib/site";

export async function sendBookingEmails(booking: BookingRequest) {
  if (!process.env.RESEND_API_KEY) return { skipped: true };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const businessEmail = process.env.BOOKING_NOTIFY_EMAIL ?? "connect@dtdogs.ca";
  const from = process.env.EMAIL_FROM ?? "DTdogs.ca <onboarding@resend.dev>";

  await Promise.all([
    resend.emails.send({
      from,
      to: businessEmail,
      subject: `New booking request: ${booking.service}`,
      text: [
        `New booking request from ${booking.customerName}`,
        `Email: ${booking.email}`,
        `Phone: ${booking.phone}`,
        `Service: ${booking.service}`,
        `Preferred: ${booking.preferredDate} ${booking.preferredTime}`,
        `Pet: ${booking.petName} (${booking.petType})`,
        `Notes: ${booking.notes ?? "None"}`,
      ].join("\n"),
    }),
    resend.emails.send({
      from,
      to: booking.email,
      subject: "We received your DTdogs.ca booking request",
      text: [
        `Hi ${booking.customerName},`,
        "",
        "Thank you for reaching out to DTdogs.ca. We received your booking request and will contact you to confirm availability and next steps.",
        "",
        `Service: ${booking.service}`,
        `Preferred: ${booking.preferredDate} ${booking.preferredTime}`,
        "",
        "DTdogs.ca",
      ].join("\n"),
    }),
  ]);

  return { skipped: false };
}
