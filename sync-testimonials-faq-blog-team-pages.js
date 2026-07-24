const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017/dtdogs";

const pages = [
  {
    slug: "testimonials",
    title: "Testimonials",
    navTitle: "Testimonials",
    seoTitle: "DTdogs.ca Testimonials | Trusted Pet Care GTA",
    metaDescription: "Approved client testimonials for DTdogs.ca pet care services across the Greater Toronto Area.",
    status: "published",
    hero: {
      eyebrow: "Trusted by pet parents across GTA",
      title: "Real reviews belong here, carefully managed and approved.",
      body: "Honesty is the Best Policy, feel free to share your review and read what Petparents have to say about us.",
      primaryCta: { label: "Book Now", href: "/booking" },
      images: [],
    },
    blocks: [
      {
        type: "testimonials",
        title: "Approved review library",
        body: "",
        items: [],
        images: [],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    navTitle: "FAQ",
    seoTitle: "DTdogs.ca FAQ | Pet Care Booking, Boarding & Chauffeur Questions",
    metaDescription: "Answers to common DTdogs.ca questions about booking, services, vaccinations, boarding, chauffeur service and policies.",
    status: "published",
    hero: {
      eyebrow: "Clear answers before care begins",
      title: "Everything pet parents should know before booking.",
      body: "Quick answers on booking, boarding, walks, and care — so you feel ready before you meet us.",
      primaryCta: { label: "Book Now", href: "/booking" },
      secondaryCta: { label: "Contact Us", href: "/contact" },
      images: [],
    },
    blocks: [
      {
        type: "faq",
        title: "Common questions",
        body: "",
        items: [],
        images: [],
      },
    ],
  },
  {
    slug: "blog",
    title: "The Paw Journal",
    navTitle: "Journal",
    seoTitle: "The Paw Journal | DTdogs.ca Pet Care Notes",
    metaDescription: "Care guides, boarding preparation, canine behaviour notes and GTA pet-care stories from DTdogs.ca.",
    status: "published",
    hero: {
      eyebrow: "The Paw Journal",
      title: "Helpful notes for #petparents and #petpeople",
      body: "Short logs from our care days — boarding tips, walk routines, and calm stories from pet parents across the GTA.",
      primaryCta: { label: "Read Guides", href: "#posts" },
      images: [],
    },
    blocks: [
      {
        type: "cards",
        title: "Latest posts",
        body: "",
        items: [],
        images: [],
      },
    ],
  },
  {
    slug: "team",
    title: "Our Team",
    navTitle: "Our Team",
    seoTitle: "Our Team | DTdogs.ca Premium Pet Care",
    metaDescription: "Meet the people behind DTdogs.ca and the experience, calm energy and compassion they bring to pet care.",
    status: "published",
    hero: {
      eyebrow: "Experienced hands. Calm energy. Genuine care.",
      title: "#PetPeople your Pet feels comfortable with.",
      body: "Certified and Experienced Professionals caring for you Pet with Insurance and Care across GTA.",
      primaryCta: { label: "Meet Us", href: "#team" },
      images: [],
    },
    blocks: [],
  },
];

async function sync() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("pages");

    let addedCount = 0;
    let updatedCount = 0;

    for (const page of pages) {
      const existing = await collection.findOne({ slug: page.slug });

      if (existing) {
        // Update existing page
        await collection.updateOne({ slug: page.slug }, { $set: page });
        console.log(`✅ Updated page: ${page.slug} (${page.title})`);
        updatedCount++;
      } else {
        // Insert new page
        await collection.insertOne(page);
        console.log(`✅ Added new page: ${page.slug} (${page.title})`);
        addedCount++;
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   Added: ${addedCount}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Total processed: ${pages.length}`);
    console.log("\n✨ Done! These 4 pages are now editable from admin panel:");
    console.log("   - Testimonials (/testimonials)");
    console.log("   - FAQ (/faq)");
    console.log("   - Blog (/blog)");
    console.log("   - Team (/team)");
    console.log("\n📝 Edit hero content from: Admin Panel → Pages");
    console.log("📝 Manage individual items from separate admin sections:");
    console.log("   - Admin → Team (for team members)");
    console.log("   - Admin → FAQs (for FAQ items)");
    console.log("   - Admin → Blog (for blog posts)");
    console.log("   - Admin → Testimonials would need to be added if not exists");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

sync();
