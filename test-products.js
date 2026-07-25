const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    
    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.model("Product", productSchema);
    
    const products = await Product.find();
    
    console.log("\n📦 All Products in Database:\n");
    products.forEach(p => {
      console.log(`Slug: ${p.slug}`);
      console.log(`Title: ${p.title}`);
      console.log(`Status: ${p.status}`);
      console.log(`Price: ${p.priceLabel}`);
      console.log(`Images: ${p.images ? p.images.length : 0}`);
      if (p.images && p.images.length > 0) {
        p.images.forEach((img, i) => {
          console.log(`  Image ${i+1}: ${img.url}`);
        });
      }
      console.log("---");
    });
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  });
