// Add Blog 2: How to Tell If Your Dog Is Stressed
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

const blog2 = {
  slug: "dog-stress-signs-15-signals",
  title: "How to Tell If Your Dog Is Stressed: 15 Signs Every Dog Owner Should Know",
  excerpt: "Dogs can't use words to tell us when they are feeling overwhelmed, anxious, or fearful. Instead, their bodies speak volumes. As a behaviourist, one of the most common things I see is well-meaning owners missing the early, subtle whispers of stress—until the dog is forced to 'shout' through reactivity or aggression.",
  category: "Behaviour",
  author: "Sunny - Sunnyism.Pro",
  date: "2025-01-20",
  body: `Dogs can't use words to tell us when they are feeling overwhelmed, anxious, or fearful. Instead, their bodies speak volumes. As a behaviourist, one of the most common things I see is well-meaning owners missing the early, subtle whispers of stress—until the dog is forced to "shout" through reactivity or aggression.

Being able to read your dog's stress signals is the foundation of building trust and keeping them safe. Whether you're out on a walk, visiting a new environment, or just relaxing at home, here are 15 signs of stress you need to know.

## The Subtle Shifts: Body Language

Often, the earliest signs of stress happen entirely in the face and posture.

### 1. "Whale Eye"

This happens when a dog turns their head slightly away but keeps their eyes fixed on whatever is stressing them out, revealing the white part of their eye (the sclera) in a half-moon shape.

### 2. Pinned Back Ears

While a relaxed dog's ears will sit in their natural, neutral position, a stressed dog will often pull their ears flat and tight against their head.

### 3. Tucked Tail

A classic sign of fear. A dog tucking their tail tightly between their hind legs is trying to make themselves look as small as possible and protect their vulnerable areas.

### 4. Lip Licking

If your dog is quickly flicking their tongue out to lick their nose or lips—and there isn't any food around—this is a pacifying gesture used to soothe anxiety.

### 5. Stress Yawning

Dogs yawn when they're tired, but a "stress yawn" is usually wider, more prolonged, and happens entirely out of context (like right after a stranger tries to pet them).

## Vocalizations and Movement

When a dog's internal stress levels rise, it often leaks out through their physical actions.

### 6. Pacing

Just like an anxious human pacing a waiting room, a stressed dog may walk back and forth incessantly, unable to settle down and relax.

### 7. Panting (Out of Context)

If it's a cool day and your dog hasn't been exercising, heavy, shallow panting with a tight, pulled-back mouth (often called a "spatulate tongue") is a major red flag for acute stress.

### 8. Trembling or Shaking

Unless the temperature has plummeted, a dog shivering or shaking is likely experiencing a significant adrenaline dump caused by fear.

### 9. Excessive Barking or Whining

While dogs bark for many reasons, a high-pitched, repetitive bark or persistent, unsettled whining is a vocal release of nervous tension.

## Avoidance and "Displacement" Behaviours

When a dog is unsure how to handle a situation, they will either try to escape it or engage in an unrelated activity to distract themselves (known as a displacement behaviour).

### 10. Avoiding Eye Contact

If your dog is actively turning their head away from an approaching person or dog, they are politely saying, "I do not want to interact with you."

### 11. Hiding or Cowering

A dog retreating behind your legs, under a chair, or trying to back out of their collar is experiencing "flight" mode. Never force a cowering dog to interact.

### 12. Sudden Sniffing

If a dog is walking normally and suddenly stops to intensely sniff a random patch of concrete as another dog approaches, they are often faking an interest in the ground to avoid conflict.

### 13. Out-of-Context Scratching

Similar to sniffing, a sudden, frantic itch behind the ear in a tense moment is a common displacement behaviour used to relieve anxiety.

## Changes in Routine Behaviour

Sometimes stress isn't a reaction to an immediate trigger, but a chronic issue that shifts their daily baseline.

### 14. Loss of Appetite

When a dog is stressed, their digestive system shuts down as their body prepares for fight-or-flight. If your highly food-motivated dog suddenly refuses a high-value treat, their stress levels have peaked.

### 15. Sudden Indoor Accidents

A house-trained dog suddenly urinating or defecating indoors (assuming medical issues are ruled out) can be a sign of extreme anxiety, especially separation anxiety or a reaction to a major household change.

## What to Do If You Spot These Signs

If your dog is exhibiting these signals, your first job is to increase distance between your dog and the stressor. Give them the space they need to decompress. Never punish a dog for growling or showing stress—punishing the warning sign just teaches them to skip the warning and go straight to a bite.

By listening to what your dog's body is telling you, you can advocate for them before a situation escalates.

— www.Sunnyism.Pro for DTdogs.ca`,
  featuredImage: {
    id: "blog-2-featured",
    title: "Stressed Dog Body Language",
    alt: "Dog showing stress signals with pinned back ears and whale eye",
    caption: "Learning to read your dog's stress signals is essential for their wellbeing",
    url: "/images/blog/blog-dog-stress-signals.webp",
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

    const exists = await blogsCollection.findOne({ slug: blog2.slug });

    if (exists) {
      console.log("⚠️  Blog already exists. Updating...");
      await blogsCollection.updateOne({ slug: blog2.slug }, { $set: blog2 });
      console.log("✅ Blog updated!");
    } else {
      await blogsCollection.insertOne(blog2);
      console.log("✅ Blog added successfully!");
    }

    console.log("\n" + "=".repeat(60));
    console.log("Blog #2 Details:");
    console.log("=".repeat(60));
    console.log(`Title: ${blog2.title}`);
    console.log(`Slug: ${blog2.slug}`);
    console.log(`Category: ${blog2.category}`);
    console.log(`Author: ${blog2.author}`);
    console.log(`Date: ${blog2.date}`);
    console.log(`Status: ${blog2.status}`);
    console.log(`\nFeatured Image: ${blog2.featuredImage.url}`);
    console.log(`Inline Images: ${blog2.inlineImages.length}`);
    console.log("=".repeat(60));

    console.log("\n📝 Image Needed:");
    console.log("1. /images/blog/blog-dog-stress-signals.webp (featured)");
    
    console.log("\n🌐 View Blog:");
    console.log("http://localhost:3001/blog/dog-stress-signs-15-signals");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

addBlog();
