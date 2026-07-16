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
    default: "DTdogs.ca | Professional Pet Care · Downtown Toronto & GTA",
    template: "%s | DTdogs.ca",
  },
  description:
    "DTdogs.ca (formerly Handandpaw.ca and Handandpaw.in) — professional and structured pet care in Downtown Toronto, serving across the GTA in every season.",
  openGraph: {
    title: "DTdogs.ca",
    description: "Professional and structured pet care in Downtown Toronto, serving across the GTA in every season.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
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
