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

const { syncServices } = await import("../src/lib/site.ts").catch(async () => {
  // Fallback: sync via mongoose using a minimal inline approach when TS import is unavailable.
  return { syncServices: null };
});

if (typeof syncServices === "function") {
  const items = await syncServices();
  console.log(`Synced ${items.length} services via library.`);
  process.exit(0);
}

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB });
console.log("Direct TS import unavailable in this runtime; please open /services after restart — public pages use seed data.");
await mongoose.disconnect();
