const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const serviceSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Service = mongoose.model("Service", serviceSchema);

async function fixServiceSummaries() {
  try {
    console.log("🐕 Fixing service summaries...\n");

    const updates = [
      {
        slug: "dog-walking",
        summary: "Professional neighbourhood walks tailored to your dog's pace and energy level"
      },
      {
        slug: "grooming",
        summary: "Complete grooming services with breed-aware styling and gentle handling"
      },
      {
        slug: "daycare",
        summary: "Supervised daycare for extended stays before or after grooming appointments"
      },
      {
        slug: "boarding",
        summary: "Comfortable overnight care with personalized routines and 24/7 supervision"
      },
      {
        slug: "nail-trim",
        summary: "Quick and gentle nail clipping with grinding for smooth, tidy paws"
      },
      {
        slug: "behaviour-training",
        summary: "Positive reinforcement training focused on manners and confidence building"
      },
      {
        slug: "pet-dental-cleaning",
        summary: "Professional teeth brushing to maintain oral hygiene between vet visits"
      }
    ];

    for (const update of updates) {
      await Service.findOneAndUpdate(
        { slug: update.slug },
        { $set: { summary: update.summary } }
      );
      console.log(`✅ Updated: ${update.slug}`);
    }

    console.log("\n🎉 All service summaries updated!");
    
    // Show updated services
    const services = await Service.find();
    console.log("\n📋 Updated Services:\n");
    services.forEach(s => {
      console.log(`${s.name}`);
      console.log(`  Summary: ${s.summary}`);
      console.log();
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
}

fixServiceSummaries();
