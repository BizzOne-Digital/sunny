// Add Blog 9: Dog-Friendly Toronto Guide
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

const blog9 = {
  slug: "dog-friendly-toronto-parks-activities",
  title: "The Ultimate Guide to Dog-Friendly Toronto: Parks, Walks & Activities for Dogs",
  excerpt: "Toronto is rapidly becoming one of the best cities in North America to raise a dog. From expansive green spaces hidden within the urban jungle to a growing number of businesses welcoming our four-legged friends with open arms, there is no shortage of adventures to be had.",
  category: "Toronto Adventures",
  author: "Sunny - Sunnyism.Pro",
  date: "2025-02-25",
  body: `Toronto is rapidly becoming one of the best cities in North America to raise a dog. From expansive green spaces hidden within the urban jungle to a growing number of businesses welcoming our four-legged friends with open arms, there is no shortage of adventures to be had.

At DTdogs.ca, we see firsthand how much a vibrant, active lifestyle benefits our city dogs. Whether you are swinging by our Paw Park at 218 Queen Street East to burn off some morning energy or planning a full weekend itinerary, here is your ultimate guide to dog-friendly Toronto.

## Top Off-Leash Parks & Scenic Walks

While Toronto boasts over a thousand parks, not all are created equal when it comes to off-leash freedom. Here are a few standout locations for your daily walks:

**High Park:** This is a flagship destination for Toronto dog owners, featuring an 8.5-acre open off-leash area known as Dog Hill. Unlike many other city parks, High Park's off-leash zone offers a unique mix of natural and paved trails shaded by mature trees.

**Sherwood Park:** If you and your dog enjoy nature walks, this is a must-visit. Sherwood Park features a fully fenced off-leash boardwalk section that winds through a beautiful forested area. It allows you to walk for a few kilometres without feeling confined to a typical square dog run.

**Cherry Beach Clarke Beach Park:** Located at 1 Cherry Street, this is the perfect spot for water-loving pups. While off-leash hours are regulated to specific time periods, the sandy shores and lake access make it an unbeatable location for a sunny afternoon picnic.

## Dog-Friendly Patios & Hangouts

Thanks to recent bylaw updates, you no longer have to leave your dog at home when grabbing a drink or a bite to eat. Toronto's patio scene is more inclusive than ever.

**Black Lab Brewing:** Located in the East End, this pet-friendly taproom is the gold standard for dog owners. You and your leashed pup can hang out inside together to try their brews, and you might even be greeted by their namesake pup mascot.

**Stackt Market:** Located at 28 Bathurst Street, this ever-evolving shipping container market features massive outdoor seating areas. It is almost entirely outdoors, giving your dog plenty of space to relax while you enjoy the vibrant city atmosphere.

## Essential City Etiquette

Enjoying the city comes with the responsibility of being a good neighbor.

**Respect the Boundaries:** Always keep your dog on a leash unless you are strictly within a designated off-leash boundary. Toronto's parks are home to wildlife and sensitive natural habitats that can be easily disturbed by off-leash dogs.

**Read the Room:** Not everyone is comfortable around dogs. Ensure your dog is under control at all times, and practice basic commands like "Leave it" and recall to prevent them from rushing up to strangers or other on-leash dogs.

Toronto is a playground for you and your dog. Get out there, explore a new neighborhood, and make the most of everything this city has to offer.

— www.Sunnyism.Pro DTdogs.ca`,
  featuredImage: {
    id: "blog-9-featured",
    title: "Dog-Friendly Toronto Activities",
    alt: "Happy dog enjoying Toronto park with owner in urban setting",
    caption: "Toronto offers endless adventures for city dogs and their owners",
    url: "/images/blog/blog-toronto-dog-friendly.webp",
    width: 1400,
    height: 900,
  },
  inlineImages: [],
  status: "published",
};

async function addBlog() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const blogsCollection = db.collection("blogposts");

    const exists = await blogsCollection.findOne({ slug: blog9.slug });

    if (exists) {
      console.log("⚠️  Blog already exists. Updating...");
      await blogsCollection.updateOne({ slug: blog9.slug }, { $set: blog9 });
      console.log("✅ Blog updated!");
    } else {
      await blogsCollection.insertOne(blog9);
      console.log("✅ Blog added successfully!");
    }

    console.log("\n" + "=".repeat(60));
    console.log("Blog #9 Details:");
    console.log("=".repeat(60));
    console.log(`Title: ${blog9.title}`);
    console.log(`Slug: ${blog9.slug}`);
    console.log(`Category: ${blog9.category}`);
    console.log(`Author: ${blog9.author}`);
    console.log(`Date: ${blog9.date}`);
    console.log(`Status: ${blog9.status}`);
    console.log(`\nFeatured Image: ${blog9.featuredImage.url}`);
    console.log(`Inline Images: ${blog9.inlineImages.length}`);
    console.log("=".repeat(60));

    console.log("\n📝 Image Needed:");
    console.log("1. /images/blog/blog-toronto-dog-friendly.webp (featured)");
    
    console.log("\n🌐 View Blog:");
    console.log("http://localhost:3001/blog/dog-friendly-toronto-parks-activities");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

addBlog();
