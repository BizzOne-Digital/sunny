// Add Blog 8: Dog Grooming Guide
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

const blog8 = {
  slug: "dog-grooming-guide-frequency-tips",
  title: "How Often Should You Groom Your Dog? A Complete Grooming Guide",
  excerpt: "Keeping your dog looking sharp isn't just about aesthetics; it is a core component of their overall health and behavioral well-being. At DTdogs.ca, watching pups of all shapes and sizes socialize and play at the Paw Park reminds us daily that a well-groomed dog is a comfortable, happy dog.",
  category: "Health & Wellness",
  author: "Sunny - Sunnyism.Pro",
  date: "2025-02-20",
  body: `Keeping your dog looking sharp isn't just about aesthetics; it is a core component of their overall health and behavioral well-being. At DTdogs.ca, watching pups of all shapes and sizes socialize and play at the Paw Park reminds us daily that a well-groomed dog is a comfortable, happy dog.

But with so many different coat types, figuring out a grooming schedule can feel overwhelming. Let's break down exactly what your dog needs, step by step, to keep them feeling their absolute best.

## 1. Brushing: The Foundation of Coat Health

Brushing is the most critical part of your at-home grooming routine. It distributes natural oils, removes dead skin, and prevents painful matting.

**Short-Coated Breeds (e.g., Boxers, Pugs):** Brush once a week with a rubber curry brush or hound glove to control shedding and keep the coat shiny.

**Double-Coated Breeds (e.g., Golden Retrievers, Huskies):** Brush 2–3 times a week using a slicker brush and an undercoat rake. During the shedding season (spring and fall), expect to brush them daily to manage the "blowout."

**Curly/Wiry Coats (e.g., Poodles, Terriers):** These dogs are low-shedding but highly prone to matting. They require thorough combing and brushing almost every day, getting right down to the skin.

## 2. Bathing: Keep It Clean, But Don't Overdo It

A common mistake is bathing dogs too frequently, which strips their skin of essential natural oils, leading to dryness and irritation.

**General Rule:** Most dogs only need a bath once every 4 to 8 weeks.

**Exceptions:** If your dog loves rolling in the mud or has a specific medical skin condition, they may need more frequent washing. Always use a dog-specific shampoo, as human products have the wrong pH balance for canine skin.

## 3. Nail Trimming: The Click-Clack Test

If you can hear your dog's nails clicking on the hardwood floor, they are too long. Long nails can alter a dog's natural posture, causing joint pain and arthritis over time.

**Frequency:** Check and trim nails every 3 to 4 weeks.

**Pro Tip:** From a behavioral standpoint, handle your dog's paws daily even when you aren't clipping. Rewarding them for letting you touch their toes makes the actual trimming process much smoother and stress-free.

## 4. Ear Care: Listen Up for Health

Ear infections are incredibly common but easily preventable with routine checks.

**Frequency:** Inspect and clean your dog's ears once a month, or more frequently if they are prone to infections (like floppy-eared breeds such as Basset Hounds or Cocker Spaniels).

**What to Look For:** Use a vet-approved ear cleanser and a cotton ball (never a Q-tip). If the ear is red, inflamed, or has a funky, yeasty odor, it's time to skip the home cleaning and consult a vet.

## 5. Breed-Specific Considerations

No two dogs are exactly alike, and their grooming needs reflect their genetics.

**Hair-Growing Breeds:** Dogs with hair that continually grows (like Poodles, Shih Tzus, and Bichon Frises) need a professional haircut every 4 to 6 weeks to prevent severe matting.

**Wrinkled Breeds:** Bulldogs, Pugs, and Mastiffs need the folds of their skin wiped down daily or every other day with canine-safe wipes to prevent bacterial buildup and infections.

Establishing a consistent grooming routine does more than keep your furniture clean—it acts as a regular physical exam, helping you spot lumps, bumps, or skin issues early. Keep the sessions short, use plenty of high-value treats, and turn grooming into a positive bonding experience.

— www.Sunnyism.Pro DTdogs.ca`,
  featuredImage: {
    id: "blog-8-featured",
    title: "Dog Grooming Schedule Guide",
    alt: "Dog being professionally groomed with brushes and grooming tools",
    caption: "Regular grooming maintains health and strengthens your bond",
    url: "/images/blog/blog-dog-grooming-guide.webp",
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

    const exists = await blogsCollection.findOne({ slug: blog8.slug });

    if (exists) {
      console.log("⚠️  Blog already exists. Updating...");
      await blogsCollection.updateOne({ slug: blog8.slug }, { $set: blog8 });
      console.log("✅ Blog updated!");
    } else {
      await blogsCollection.insertOne(blog8);
      console.log("✅ Blog added successfully!");
    }

    console.log("\n" + "=".repeat(60));
    console.log("Blog #8 Details:");
    console.log("=".repeat(60));
    console.log(`Title: ${blog8.title}`);
    console.log(`Slug: ${blog8.slug}`);
    console.log(`Category: ${blog8.category}`);
    console.log(`Author: ${blog8.author}`);
    console.log(`Date: ${blog8.date}`);
    console.log(`Status: ${blog8.status}`);
    console.log(`\nFeatured Image: ${blog8.featuredImage.url}`);
    console.log(`Inline Images: ${blog8.inlineImages.length}`);
    console.log("=".repeat(60));

    console.log("\n📝 Image Needed:");
    console.log("1. /images/blog/blog-dog-grooming-guide.webp (featured)");
    
    console.log("\n🌐 View Blog:");
    console.log("http://localhost:3001/blog/dog-grooming-guide-frequency-tips");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

addBlog();
