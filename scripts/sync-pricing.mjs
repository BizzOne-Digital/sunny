import fs from "node:fs";
import mongoose from "mongoose";

const envPath = fs.existsSync(".env.local") ? ".env.local" : ".env";
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);

process.env.MONGODB_URI = env.MONGODB_URI;
process.env.MONGODB_DB = env.MONGODB_DB || "dtdogs";

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

const packages = [
  {
    slug: "pay-as-you-go-half-day",
    service: "Dog Daycare",
    name: "Pay as you Go",
    priceLabel: "$40",
    duration: "Half Day Play (up to 6 hrs)",
    features: ["Half Day Play (up to 6 hrs)", "Structured Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "pay-as-you-go-full-day",
    service: "Dog Daycare",
    name: "Pay as you Go",
    priceLabel: "$60",
    duration: "Full Day Play (up to 10 hrs)",
    features: ["Full Day Play (up to 10 hrs)", "Structured Enrichment Activities"],
    featured: true,
    status: "published",
  },
  {
    slug: "overnight-boarding",
    service: "Dog Boarding",
    name: "Overnight Boarding",
    priceLabel: "$80",
    duration: "Overnight stay",
    features: ["Boarding from the comfort of home", "Daycare included", "Structured Enrichment Activities"],
    featured: true,
    status: "published",
  },
  {
    slug: "5-half-day-package",
    service: "Dog Daycare",
    name: "5 Half Day Package",
    priceLabel: "$195",
    duration: "Expires 10 days after purchase",
    features: ["5 Half Day (up to 6 hrs) Play", "Package expires 10 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "5-full-day-package",
    service: "Dog Daycare",
    name: "5 Full Day Package",
    priceLabel: "$270",
    duration: "Expires 10 days after purchase",
    features: ["5 Full Day (up to 10 hrs) Play", "Package expires 10 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "10-half-day-package",
    service: "Dog Daycare",
    name: "10 Half Day Package",
    priceLabel: "$390",
    duration: "Expires 20 days after purchase",
    features: ["10 Half Day (up to 6 hrs) Play", "Package expires 20 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "10-full-day-package",
    service: "Dog Daycare",
    name: "10 Full Day Package",
    priceLabel: "$540",
    duration: "Expires 20 days after purchase",
    features: ["10 Full Day (up to 10 hrs) Play", "Package expires 20 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "20-half-day-package",
    service: "Dog Daycare",
    name: "20 Half Day Package",
    priceLabel: "$780",
    duration: "Expires 40 days after purchase",
    features: ["20 Half Day (up to 6 hrs) Play", "Package expires 40 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "20-full-day-package",
    service: "Dog Daycare",
    name: "20 Full Day Package",
    priceLabel: "$1,080",
    duration: "Expires 40 days after purchase",
    features: ["20 Full Day (up to 10 hrs) Play", "Package expires 40 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: false,
    status: "published",
  },
  {
    slug: "28-full-day-package",
    service: "Dog Daycare",
    name: "28 Full Day Package",
    priceLabel: "$1,480",
    duration: "Expires 56 days after purchase",
    features: ["28 Full Day (up to 10 hrs) Play", "Package expires 56 days after purchase", "Structured Daycare with Enrichment Activities"],
    featured: true,
    status: "published",
  },
];

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB });
const pricingCol = mongoose.connection.collection("pricingpackages");
const before = await pricingCol.countDocuments();
await pricingCol.deleteMany({});
await pricingCol.insertMany(packages);
const after = await pricingCol.countDocuments();

await mongoose.connection.collection("pages").updateOne(
  { slug: "pricing" },
  {
    $set: {
      title: "Pricing",
      navTitle: "Pricing",
      seoTitle: "DTdogs.ca Pricing | Dog Daycare, Boarding & Dog Walks",
      metaDescription:
        "View DTdogs.ca daycare, boarding and package pricing across the Greater Toronto Area — from pay-as-you-go days to overnight boarding and multi-day packages.",
      hero: {
        eyebrow: "Dog Daycare, Boarding & Dog Walks",
        title: "Clear packages for structured play, enrichment and overnight care.",
        body: "Choose pay-as-you-go daycare, overnight boarding, or value packages — all with structured enrichment activities.",
        primaryCta: { label: "Book Now", href: "/booking" },
        secondaryCta: { label: "Contact Us", href: "/contact" },
      },
      blocks: [],
      status: "published",
    },
  },
  { upsert: true },
);

console.log(`Pricing sync complete. Removed ${before} old packages, inserted ${after} new packages.`);
await mongoose.disconnect();
