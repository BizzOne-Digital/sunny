const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/dtdogs")
  .then(async () => {
    console.log("✅ Connected to MongoDB\n");
    
    const Service = mongoose.model("Service", new mongoose.Schema({}, {strict: false}));
    const services = await Service.find();
    
    console.log("🐕 Services in Database:\n");
    services.forEach(s => {
      console.log(`${s.name}`);
      console.log(`  Slug: ${s.slug}`);
      console.log(`  Eyebrow: ${s.eyebrow}`);
      console.log(`  Description: ${s.description.substring(0, 80)}...`);
      console.log(`  Images: ${s.images ? s.images.length : 0}`);
      console.log("---");
    });
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  });
