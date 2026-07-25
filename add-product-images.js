const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const productSchema = new mongoose.Schema({
  slug: String,
  title: String,
  description: String,
  priceLabel: String,
  status: String,
  images: [{ id: String, url: String, alt: String, title: String, order: Number }],
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

async function addProductImages() {
  try {
    console.log("🖼️ Adding images to products...");

    // Dog Dad Merch
    await Product.findOneAndUpdate(
      { slug: "dog-dad-merch" },
      {
        $set: {
          images: [
            {
              id: "dog-dad-main",
              url: "/images/shop/shop-dad.webp",
              alt: "Dog Dad long-sleeve shirt",
              title: "Dog Dad Merch",
              order: 1,
            }
          ]
        }
      }
    );
    console.log("✅ Dog Dad Merch images added");

    // Dog Mom Merch
    await Product.findOneAndUpdate(
      { slug: "dog-mom-merch" },
      {
        $set: {
          images: [
            {
              id: "dog-mom-main",
              url: "/images/shop/shop-mom.webp",
              alt: "Dog Mom long-sleeve shirt",
              title: "Dog Mom Merch",
              order: 1,
            }
          ]
        }
      }
    );
    console.log("✅ Dog Mom Merch images added");

    // Gift Card already has image
    console.log("✅ Gift Card already has image");

    console.log("\n🎉 All product images added successfully!");
    
    // Show updated products
    const products = await Product.find();
    console.log("\n📦 Updated Products:");
    products.forEach(p => {
      console.log(`- ${p.title}: ${p.images.length} images`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
}

addProductImages();
