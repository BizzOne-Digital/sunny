// Script to migrate Bundle collection to PricingPackage collection
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

async function migrateBundlesToPricing() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    // Check if bundles collection exists
    const collections = await db.listCollections().toArray();
    const bundlesExists = collections.some((col) => col.name === "bundles");
    const pricingExists = collections.some((col) => col.name === "pricingpackages");

    console.log("\nCollection Status:");
    console.log(`- bundles collection: ${bundlesExists ? "EXISTS" : "NOT FOUND"}`);
    console.log(`- pricingpackages collection: ${pricingExists ? "EXISTS" : "NOT FOUND"}`);

    if (!bundlesExists) {
      console.log("\n✅ No bundles collection found. Nothing to migrate.");
      return;
    }

    // Get data from bundles collection
    const bundlesCollection = db.collection("bundles");
    const bundles = await bundlesCollection.find({}).toArray();

    console.log(`\nFound ${bundles.length} documents in bundles collection`);

    if (bundles.length === 0) {
      console.log("✅ No data to migrate.");
      return;
    }

    // Migrate to pricingpackages collection
    const pricingCollection = db.collection("pricingpackages");

    for (const bundle of bundles) {
      // Check if already exists in pricingpackages
      const exists = await pricingCollection.findOne({ slug: bundle.slug });

      if (exists) {
        console.log(`- Skipping ${bundle.slug} (already exists in pricingpackages)`);
      } else {
        await pricingCollection.insertOne(bundle);
        console.log(`✅ Migrated: ${bundle.name} (${bundle.slug})`);
      }
    }

    console.log("\n✅ Migration complete!");
    console.log("\nYou can now safely delete the bundles collection:");
    console.log("db.bundles.drop()");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

migrateBundlesToPricing();
