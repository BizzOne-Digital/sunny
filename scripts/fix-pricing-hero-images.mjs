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

await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB || "dtdogs" });

const pages = mongoose.connection.collection("pages");
const pricingPage = await pages.findOne({ slug: "pricing" });
const imagesMissing = !pricingPage?.hero?.images?.length;

if (imagesMissing) {
  await pages.updateOne(
    { slug: "pricing" },
    {
      $set: {
        "hero.images": [
          {
            id: "policy-care",
            title: "Care policy image",
            alt: "Calm pet care environment for pricing page",
            url: "/images/policy/policy-care.webp",
          },
          {
            id: "grooming",
            title: "Grooming",
            alt: "Dog grooming care",
            url: "/images/services/servicesgrooming.webp",
          },
          {
            id: "boarding-home",
            title: "Boarding",
            alt: "Home style boarding",
            url: "/images/services/servicesboarding-home.webp",
          },
          {
            id: "chauffeur",
            title: "Pet transport",
            alt: "Pet chauffeur service",
            url: "/images/services/serviceschauffeur.webp",
          },
          {
            id: "booking-bg",
            title: "Booking",
            alt: "Booking background",
            url: "/images/booking/booking-bg.webp",
          },
        ],
      },
    },
  );
  console.log("Restored missing pricing hero images only.");
} else {
  console.log("Pricing hero images already present. No changes.");
}

await mongoose.disconnect();
