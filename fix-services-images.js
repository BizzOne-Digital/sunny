const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017/dtdogs";

async function fixServices() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("services");

    // Find all services without images array or with undefined images
    const services = await collection.find({}).toArray();
    
    let fixedCount = 0;

    for (const service of services) {
      if (!service.images || !Array.isArray(service.images)) {
        // Update to add empty images array
        await collection.updateOne(
          { _id: service._id },
          { 
            $set: { 
              images: [],
              benefits: service.benefits || [],
              includes: service.includes || [],
              process: service.process || [],
              related: service.related || [],
              faqs: service.faqs || []
            } 
          }
        );
        console.log(`✅ Fixed service: ${service.slug} (${service.name})`);
        fixedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total services: ${services.length}`);
    console.log(`   Fixed: ${fixedCount}`);
    console.log(`   Already OK: ${services.length - fixedCount}`);
    
    if (fixedCount > 0) {
      console.log("\n✨ Services fixed! All services now have images array.");
    } else {
      console.log("\n✨ All services already have proper structure.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

fixServices();
