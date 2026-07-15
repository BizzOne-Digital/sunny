import { NextResponse } from "next/server";
import { z } from "zod";
import { sendBookingEmails } from "@/lib/email";
import { BookingRequest, connectMongo, Models } from "@/lib/site";

const bookingSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().optional(),
  preferredContact: z.string().optional(),
  service: z.string().min(2),
  packageSelection: z.string().optional(),
  preferredDate: z.string().min(4),
  preferredTime: z.string().min(2),
  pickupTime: z.string().optional(),
  dropoffTime: z.string().optional(),
  shuttleRequested: z.string().optional(),
  petName: z.string().min(1),
  petType: z.string().min(1),
  breed: z.string().optional(),
  age: z.string().optional(),
  weight: z.string().optional(),
  sex: z.string().optional(),
  spayNeuterStatus: z.string().optional(),
  temperament: z.string().optional(),
  specialNeeds: z.string().optional(),
  vaccinationStatus: z.string().optional(),
  fullName: z.string().optional(),
  medicalDetails: z.string().optional(),
  allergies: z.string().optional(),
  feedingInstructions: z.string().optional(),
  emergencyContact: z.string().optional(),
  veterinarian: z.string().optional(),
  behaviouralNotes: z.string().optional(),
  vaccinationUploadNote: z.string().optional(),
  giftCardCode: z.string().optional(),
  paymentNote: z.string().optional(),
  notes: z.string().optional(),
  policyAgreement: z.boolean(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required booking fields.", details: parsed.error.flatten() }, { status: 400 });
  }

  if (!parsed.data.policyAgreement) {
    return NextResponse.json({ error: "Policy agreement is required." }, { status: 400 });
  }

  if (!(await connectMongo())) {
    return NextResponse.json({ error: "MONGODB_URI is required for booking submissions." }, { status: 500 });
  }

  const booking: BookingRequest = {
    ...parsed.data,
    customerName: parsed.data.customerName || parsed.data.fullName || "Customer",
    status: "Awaiting Payment" as BookingRequest["status"],
    paymentStatus: "Payment Pending",
  };

  await Models.Booking().create(booking);
  await sendBookingEmails(booking);

  return NextResponse.json({ ok: true });
}
