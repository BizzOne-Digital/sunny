// Add Blog 1: Dog Boarding vs. Dog Sitting
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

const blog1 = {
  slug: "dog-boarding-vs-dog-sitting",
  title: "Dog Boarding vs. Dog Sitting: Which Is Better for Your Dog?",
  excerpt: "Leaving town is stressful, but leaving your dog behind is often the hardest part of the trip. As a behaviourist, I am constantly asked whether a dog should go to a boarding facility or stay home with a pet sitter.",
  category: "Care Tips",
  author: "Sunny - Sunnyism.Pro",
  date: "2025-01-15",
  body: `Leaving town is stressful, but leaving your dog behind is often the hardest part of the trip. As a behaviourist, I am constantly asked whether a dog should go to a boarding facility or stay home with a pet sitter.

The truth is, there is no universal right answer. A setup that feels like a fun summer camp to one dog might feel entirely overwhelming to another. Choosing the right option comes down to understanding your dog's unique temperament, age, and individual needs. Here is how to decide.

## The Case for Dog Boarding

Boarding facilities operate like a hotel and daycare combined. Dogs sleep in their own designated areas at night but often spend their days playing with a pack under staff supervision.

### The Benefits:

The biggest draw of a boarding facility is the physical outlet. Dogs get consistent, structured routine and professional supervision. Because their days are filled with playing, sniffing, and interacting, they often don't have the time or energy to sit around missing you.

### Ideal For:

**High-Energy Breeds:** Working dogs that need to burn off steam.

**Social Butterflies:** Dogs that actively seek out playtime with other dogs.

**Daycare Regulars:** If your dog already loves going to a structured daycare (like our Paw Park!), a boarding facility is just a seamless extension of a routine they already enjoy.

### What to Look For:

Always look for facilities that require a temperament test before booking. Ask about staff-to-dog ratios, whether the staff is trained in canine body language, and how they handle rest periods to prevent overstimulation.

## The Case for In-Home Dog Sitting

With dog sitting, a dedicated professional either stays at your home or takes your dog into their own quiet house.

### The Benefits:

The primary benefit is environmental consistency. Your dog gets to sleep in their usual spot, hear the familiar sounds of their neighborhood, and receive one-on-one human attention. Keeping their environment stable drastically lowers cortisol (stress) levels.

### Ideal For:

**Seniors & Puppies:** Older dogs who need quiet, and young puppies who aren't fully vaccinated yet.

**Reactive or Anxious Dogs:** Dogs who are easily overwhelmed by loud noises or strange dogs.

**Medical Needs:** Dogs requiring strict medication schedules or physical limitations.

### What to Look For:

Look for a sitter who is pet CPR and First Aid certified. Ask for references and insist on a meet-and-greet in your home to see how their energy meshes with your dog.

## Preparation Tips for Success

Whether your dog is heading to a facility or staying on their own couch, you need to set them up for success before you hand over the leash.

**Do a Trial Run:** Never leave your dog for a two-week vacation without a test drive. Book them for a single night of boarding or have the sitter come over for a half-day while you are at work.

**Pack the Smells of Home:** Scent is a dog's strongest sense. If they are boarding, send an unwashed t-shirt or pillowcase with your scent on it to soothe them at bedtime.

**Over-Communicate:** Write down everything. Leave a detailed list of their feeding schedule, hiding spots, unusual quirks, triggers, and your vet's emergency contact information.

Ultimately, evaluate who your dog is right now. If they thrive in a pack, a reputable facility is a great choice. If they prefer quiet evenings and a familiar couch, a sitter is your best bet.

— www.Sunnyism.Pro for DTdogs.ca`,
  featuredImage: {
    id: "blog-1-featured",
    title: "Dog Boarding vs Dog Sitting",
    alt: "Dog resting comfortably in boarding facility with caregiver nearby",
    caption: "Choosing between boarding and sitting depends on your dog's personality",
    url: "/images/blog/blog-boarding-vs-sitting.webp",
    width: 1400,
    height: 900,
  },
  inlineImages: [
    {
      id: "blog-1-inline-1",
      title: "Dog playing at boarding facility",
      alt: "Happy dogs playing together in supervised boarding daycare",
      caption: "Boarding facilities offer socialization and structured play",
      url: "/images/blog/blog-boarding-facility.webp",
      width: 1200,
      height: 800,
    },
    {
      id: "blog-1-inline-2",
      title: "Dog sitting at home",
      alt: "Calm dog relaxing at home with pet sitter",
      caption: "In-home sitting provides familiar environment and one-on-one attention",
      url: "/images/blog/blog-dog-sitting-home.webp",
      width: 1200,
      height: 800,
    },
  ],
  status: "published",
};

async function addBlog() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const blogsCollection = db.collection("blogposts");

    // Check if blog already exists
    const exists = await blogsCollection.findOne({ slug: blog1.slug });

    if (exists) {
      console.log("⚠️  Blog already exists. Updating...");
      await blogsCollection.updateOne(
        { slug: blog1.slug },
        { $set: blog1 }
      );
      console.log("✅ Blog updated!");
    } else {
      await blogsCollection.insertOne(blog1);
      console.log("✅ Blog added successfully!");
    }

    console.log("\n" + "=".repeat(60));
    console.log("Blog Details:");
    console.log("=".repeat(60));
    console.log(`Title: ${blog1.title}`);
    console.log(`Slug: ${blog1.slug}`);
    console.log(`Category: ${blog1.category}`);
    console.log(`Author: ${blog1.author}`);
    console.log(`Date: ${blog1.date}`);
    console.log(`Status: ${blog1.status}`);
    console.log(`\nFeatured Image: ${blog1.featuredImage.url}`);
    console.log(`Inline Images: ${blog1.inlineImages.length}`);
    console.log("=".repeat(60));

    console.log("\n📝 Image Placeholders Created:");
    console.log("You need to add these images to the blog folder:");
    console.log("1. /images/blog/blog-boarding-vs-sitting.webp (featured)");
    console.log("2. /images/blog/blog-boarding-facility.webp (inline 1)");
    console.log("3. /images/blog/blog-dog-sitting-home.webp (inline 2)");
    
    console.log("\n🌐 View Blog:");
    console.log("http://localhost:3001/blog");
    console.log("http://localhost:3001/blog/dog-boarding-vs-dog-sitting");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

addBlog();
