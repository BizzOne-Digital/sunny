// Add Blog 6: New Dog Checklist
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

const blog6 = {
  slug: "new-dog-checklist-complete-guide",
  title: "The New Dog Checklist: Everything You Need Before Bringing Your Dog Home",
  excerpt: "Bringing a new dog home is one of life's greatest joys—and let's be honest, one of its biggest adjustments. Whether you are welcoming an eight-week-old puppy or adopting a mellow senior rescue, those first few weeks set the tone for your life together.",
  category: "Care Tips",
  author: "Sunny - Sunnyism.Pro",
  date: "2025-02-10",
  body: `Bringing a new dog home is one of life's greatest joys—and let's be honest, one of its biggest adjustments. Whether you are welcoming an eight-week-old puppy or adopting a mellow senior rescue, those first few weeks set the tone for your life together. It is completely normal to feel a mix of overwhelming love and sudden panic when you realize another living creature relies entirely on you.

Take a breath. You've got this.

To help you skip the guesswork and focus on bonding, here is your comprehensive checklist covering everything from the physical supplies to the daily routines that will set your new best friend up for success.

## 1. The Starter Gear: Essential Supplies

Before your dog's paws cross the threshold, have these basics ready to go. Rushing to the pet store on day one is a headache you don't need.

**The Hardware:** An adjustable collar or harness, a 6-foot nylon or leather leash (skip the retractable ones, which can teach dogs to pull), and an ID tag with your current phone number.

**Dining Setup:** Two sturdy, easy-to-clean bowls (stainless steel or ceramic) and high-quality dog food. **Pro Tip:** Ask the breeder or shelter what they are currently eating. If you plan to switch brands, do it gradually over 7–10 days by mixing the old and new food to avoid an upset stomach.

**A Safe Space:** A crate (if you plan to crate train) and a comfortable, washable bed.

**Potty Supplies:** Poop bags and a dispenser for walks. If you have a puppy, stock up on enzyme cleaners (which eliminate the pheromones that draw dogs back to the same spot) and pee pads for inevitable indoor accidents.

**Entertainment:** A mix of durable chew toys, interactive puzzle toys to burn mental energy, and a plush comfort toy.

## 2. Health & Safety First

Your dog's health is the foundation of their happiness.

**The First Vet Visit:** Schedule a check-up within 48 to 72 hours of bringing them home. This establishes a baseline for their health and lets you discuss a vaccination schedule, flea/tick prevention, and heartworm medication.

**Microchipping:** If your dog isn't already microchipped, get it done immediately. It's a fast, painless procedure that acts as a permanent safety net if they ever get lost.

**Puppy-Proofing:** Get down on their eye level. Secure loose electrical cords, move toxic houseplants out of reach, lock away cleaning supplies, and pick up small items (like socks or kids' toys) that look like tempting chewables.

## 3. Establishing the Routine

Dogs are creatures of habit. They thrive on predictability, which drastically reduces their anxiety in a new environment.

**Feeding Schedule:** Most adult dogs do well with two meals a day, while puppies usually need three to four. Stick to consistent times.

**Potty Breaks:** Take them out first thing in the morning, right after meals, after naps, and right before bed. Praise heavily when they go outside!

**The 3-3-3 Rule:** Keep this timeline in mind, especially for rescues. It generally takes 3 days for them to decompress, 3 weeks to learn your routine, and 3 months to truly feel at home. Patience is your best tool.

## 4. Brain & Body: Training and Socialization

A tired dog is a good dog, but mental fatigue is just as important as physical exercise.

**Positive Reinforcement:** Reward the behavior you want to see with treats, praise, or play. Ignore or gently redirect unwanted behavior rather than resorting to punishment.

**Basic Commands:** Start immediately with the fundamentals: Sit, Stay, Come, and Leave it. Short, 5-minute training sessions a few times a day are far more effective than an hour-long marathon.

**Socialization:** This isn't just about meeting other dogs; it's about exposing them to new sights, sounds, and surfaces safely. Let them hear the vacuum from a distance, walk on different types of flooring, and see people wearing hats or carrying umbrellas.

## 5. Spa Day Every Day: Grooming Basics

Routine grooming isn't just about looks; it prevents painful matting and expensive veterinary bills down the line.

**Brushing:** Depending on their coat length and type, they may need daily brushing or just a quick once-over weekly. Make it a calming, highly rewarded experience.

**Nail Trims:** Long nails can alter your dog's posture and cause joint pain. Start touching and massaging their paws on day one so they get used to the sensation before the clippers ever come out.

**Dental Care:** Get a dog-safe toothpaste (never human toothpaste, which contains toxic xylitol or fluoride) and a brush. Plaque buildup can lead to serious dental and organ issues in dogs later in life.

Bringing a dog into your life is a massive commitment, but the payoff is immeasurable. There will be chewed-up shoes and frustrating training days, but there will also be joyous greetings at the door, quiet evenings curled up on the couch, and a bond that changes your life for the better. Take it one day at a time, stick to the basics, and enjoy the ride.

— www.Sunnyism.Pro for DTdogs.ca`,
  featuredImage: {
    id: "blog-6-featured",
    title: "New Dog Home Preparation",
    alt: "New puppy with essential supplies and checklist for bringing dog home",
    caption: "Proper preparation ensures a smooth transition for your new family member",
    url: "/images/blog/blog-new-dog-checklist.webp",
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

    const exists = await blogsCollection.findOne({ slug: blog6.slug });

    if (exists) {
      console.log("⚠️  Blog already exists. Updating...");
      await blogsCollection.updateOne({ slug: blog6.slug }, { $set: blog6 });
      console.log("✅ Blog updated!");
    } else {
      await blogsCollection.insertOne(blog6);
      console.log("✅ Blog added successfully!");
    }

    console.log("\n" + "=".repeat(60));
    console.log("Blog #6 Details:");
    console.log("=".repeat(60));
    console.log(`Title: ${blog6.title}`);
    console.log(`Slug: ${blog6.slug}`);
    console.log(`Category: ${blog6.category}`);
    console.log(`Author: ${blog6.author}`);
    console.log(`Date: ${blog6.date}`);
    console.log(`Status: ${blog6.status}`);
    console.log(`\nFeatured Image: ${blog6.featuredImage.url}`);
    console.log(`Inline Images: ${blog6.inlineImages.length}`);
    console.log("=".repeat(60));

    console.log("\n📝 Image Needed:");
    console.log("1. /images/blog/blog-new-dog-checklist.webp (featured)");
    
    console.log("\n🌐 View Blog:");
    console.log("http://localhost:3001/blog/new-dog-checklist-complete-guide");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

addBlog();
