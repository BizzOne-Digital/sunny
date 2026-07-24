const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017/dtdogs";

const productUpdates = [
  {
    slug: "dog-mom-merch",
    updates: {
      images: [
        {
          id: "shop-mom",
          title: "Dog Mom long-sleeve shirt",
          alt: "Dog Mom long-sleeve shirt product photography",
          url: "/images/shop/shop-mom.webp",
          width: 1200,
          height: 1400,
          status: "published"
        }
      ],
      colors: ["Forest Green", "Burgundy", "Cream"],
      sizes: ["S", "M", "L", "XL"],
      status: "published"  // Change from coming-soon to published
    }
  },
  {
    slug: "dog-dad-merch",
    updates: {
      images: [
        {
          id: "shop-dad",
          title: "Dog Dad long-sleeve shirt",
          alt: "Dog Dad long-sleeve shirt product photography",
          url: "/images/shop/shop-dad.webp",
          width: 1200,
          height: 1400,
          status: "published"
        }
      ],
      colors: ["Forest Green", "Burgundy", "Cream"],
      sizes: ["S", "M", "L", "XL"],
      status: "published"  // Change from coming-soon to published
    }
  }
];

async function fixShopProducts() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("products");

    for (const { slug, updates } of productUpdates) {
      const result = await collection.updateOne(
        { slug },
        { $set: updates }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated product: ${slug}`);
        console.log(`   - Added ${updates.images.length} image(s)`);
        console.log(`   - Status: ${updates.status}`);
        console.log(`   - Sizes: ${updates.sizes.join(", ")}`);
        console.log(`   - Colors: ${updates.colors.join(", ")}`);
      } else {
        console.log(`❌ Product not found: ${slug}`);
      }
    }

    console.log("\n📊 Summary:");
    console.log("   Updated: 2 products (Dog Mom & Dog Dad Merch)");
    console.log("   Added images, sizes, colors");
    console.log("   Changed status to 'published'");
    console.log("\n✨ Shop page will now display all 3 products:");
    console.log("   1. DTdogs Digital Gift Card - $150");
    console.log("   2. Dog Mom Merch - $33.00");
    console.log("   3. Dog Dad Merch - $33.00");
    console.log("\n📝 Refresh shop page to see changes!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

fixShopProducts();
