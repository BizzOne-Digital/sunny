import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site";
import { getServices } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dtdogs.ca"),
  title: {
    default: "DTdogs.ca / Hand & Paw | Premium Pet Care GTA",
    template: "%s | DTdogs.ca",
  },
  description:
    "Premium structured pet care across the Greater Toronto Area, including dog walking, boarding, daycare, grooming, pet visits and chauffeur service.",
  openGraph: {
    title: "DTdogs.ca / Hand & Paw",
    description: "Care, comfort and companionship for pets across the GTA.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const services = await getServices();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteChrome services={services}>{children}</SiteChrome>
      </body>
    </html>
  );
}
