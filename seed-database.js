const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB Connection
const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define all schemas inline (since we can't import TS files in Node script)

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  name: { type: String, required: true },
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  eyebrow: String,
  summary: String,
  description: String,
  forWhom: String,
  benefits: [String],
  includes: [String],
  process: [String],
  faqs: [{ question: String, answer: String }],
  related: [String],
  images: [{ id: String, url: String, alt: String, title: String }],
  featured: Boolean,
  status: String,
  priceLabel: String,
  duration: String,
  priceTiers: [{ label: String, priceLabel: String }],
}, { timestamps: true });

const bundleSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  service: String,
  name: String,
  priceLabel: String,
  duration: String,
  features: [String],
  featured: Boolean,
  status: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  description: String,
  priceLabel: String,
  compareAtPriceLabel: String,
  status: String,
  images: [{ id: String, url: String, alt: String, title: String, order: Number }],
  sizes: [String],
  colors: [String],
  inventory: Number,
}, { timestamps: true });

const teamSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: String,
  role: String,
  bio: String,
  credentials: [String],
  image: { id: String, url: String, alt: String, title: String },
  instagram: String,
  status: String,
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  question: String,
  answer: String,
  category: String,
  serviceSlug: String,
  status: String,
  order: Number,
}, { timestamps: true });

// Models
const Admin = mongoose.model("Admin", adminSchema);
const Service = mongoose.model("Service", serviceSchema);
const Bundle = mongoose.model("Bundle", bundleSchema);
const Product = mongoose.model("Product", productSchema);
const Team = mongoose.model("Team", teamSchema);
const FAQ = mongoose.model("FAQ", faqSchema);

// Seed Data
const seedData = async () => {
  try {
    console.log("🗑️ Clearing existing data...");
    
    // Delete all existing data
    await Admin.deleteMany({});
    await Service.deleteMany({});
    await Bundle.deleteMany({});
    await Product.deleteMany({});
    await Team.deleteMany({});
    await FAQ.deleteMany({});

    console.log("✅ Old data cleared");

    // 1. CREATE ADMIN USER
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("Admin@12345", 10);
    await Admin.create({
      email: "admin@dtdogs.ca",
      password: hashedPassword,
      role: "super-admin",
      name: "Admin",
    });
    console.log("✅ Admin created: admin@dtdogs.ca / Admin@12345");

    // 2. CREATE SERVICES
    console.log("🐕 Creating services...");

    const services = [
      {
        slug: "dog-walking",
        name: "Dog Walking",
        eyebrow: "Structured walks",
        summary: "dog being walked",
        description: "Structured neighbourhood walks with exercise, outdoor enrichment and bathroom breaks — paced to your dog and delivered by #petpeople across the GTA.",
        forWhom: "Ideal for busy pet parents who want reliable daily or weekly walks with clear updates.",
        benefits: ["Steady exercise and enrichment", "Bathroom breaks on schedule", "Pace matched to your dog", "Serving across GTA"],
        includes: ["Leashed structured walk", "Outdoor stimulation", "Bathroom opportunities", "Personalized handling", "Optional +$5 add-on"],
        process: ["Book your walk window", "Share pace and gear notes", "We complete the walk", "You get a quick care update"],
        faqs: [
          { question: "Solo or group walks?", answer: "Walks are structured around your dog's needs and compatible arrangements when appropriate." },
          { question: "Where do you walk?", answer: "We serve Downtown Toronto and across the GTA with neighbourhood-friendly routes." }
        ],
        related: ["daycare", "boarding", "behaviour-training"],
        featured: true,
        duration: "Flexible",
        priceLabel: "From $20",
        status: "published",
        images: [],
      },
      {
        slug: "grooming",
        name: "Pet Grooming",
        eyebrow: "Clean & polished",
        summary: "grooming photo",
        description: "Professional grooming tailored to coat, breed and comfort — bath, brush, tidy finish and calm handling so your dog leaves fresh and confident.",
        forWhom: "Perfect for dogs who need a full refresh, coat care and a tidy professional finish.",
        benefits: ["Coat and skin comfort", "Breed-aware styling", "Calm spa-style handling", "Clear appointment planning"],
        includes: ["Bath and dry", "Brushing", "Hygiene tidy as needed", "Professional finish", "Optional +$5 add-on"],
        process: ["Share coat and breed notes", "Confirm appointment timing", "Enjoy the grooming session", "Receive after-care notes"],
        faqs: [
          { question: "How long does grooming take?", answer: "Most grooming visits are planned around one focused appointment; coat condition can affect timing." },
          { question: "Can nervous dogs book?", answer: "Yes — we use calm handling and can discuss temperament during booking." }
        ],
        related: ["nail-trim", "daycare", "dog-walking"],
        featured: true,
        duration: "Appointment",
        priceLabel: "$28",
        status: "published",
        images: [],
      },
      {
        slug: "daycare",
        name: "Day Care",
        eyebrow: "Exceeding 3 hrs before / after grooming",
        summary: "dogs playing",
        description: "Day care when your dog stays more than 3 hours before or after a grooming appointment — supervised play, rest and calm care while you are away.",
        forWhom: "Ideal when grooming runs long and your dog needs extended supervised care before or after the appointment.",
        benefits: ["Supervised social play", "Enrichment activities", "Scheduled rest", "Convenient with grooming visits"],
        includes: ["Day care stay exceeding 3 hrs before/after grooming", "Supervised play", "Safe socialization", "Rest periods", "Optional +$5 add-on"],
        process: ["Book with your grooming visit", "Confirm drop-off and pick-up windows", "We provide supervised day care", "Pick up after play and rest"],
        faqs: [
          { question: "When does this day care apply?", answer: "This day care rate applies when the stay exceeds 3 hours before or after a grooming appointment." },
          { question: "Can I book day care alone?", answer: "Yes — share your timing needs at booking and we will confirm the right care window." }
        ],
        related: ["boarding", "dog-walking", "behaviour-training"],
        featured: true,
        duration: "Exceeding 3 hrs before / after grooming",
        priceLabel: "$45",
        status: "published",
        images: [],
      },
      {
        slug: "boarding",
        name: "Boarding",
        eyebrow: "Home-style overnight",
        summary: "comfortable resting dogs",
        description: "Comfortable overnight boarding in a calm, supervised setting with personalized feeding, bathroom, rest and care routines based on each dog's needs.",
        forWhom: "For families who need trusted overnight care while away — including 24/7 boarding aligned with city bylaws and confirmed bookings.",
        benefits: ["Overnight supervision", "Calm rest environment", "Personalized routines", "Feeding and comfort support"],
        includes: ["Overnight boarding", "Personalized feeding", "Bathroom support", "Rest routines", "Supervised care", "Optional +$5 add-on"],
        process: ["Request overnight dates", "Share intake and medical notes", "Confirm boarding", "Receive care updates"],
        faqs: [
          { question: "Is boarding available overnight?", answer: "Yes — boarding is available 24/7 according to city bylaws and confirmed booking arrangements." },
          { question: "Can I bring my dog's food?", answer: "Yes. Familiar food helps keep routines calm during the stay." }
        ],
        related: ["daycare", "dog-walking", "grooming"],
        featured: true,
        duration: "Overnight",
        priceLabel: "From $50",
        status: "published",
        images: [],
      },
      {
        slug: "nail-trim",
        name: "Nail Trimming",
        eyebrow: "Gentle paw care",
        summary: "nail trimming image",
        description: "Careful nail clipping and grinding with calm handling — keeping paws tidy, comfortable and ready for walks without stress.",
        forWhom: "Great as a quick standalone visit or paired with grooming when nails need regular attention.",
        benefits: ["Healthier nails and paws", "Comfortable walking", "Calm handling", "Quick focused appointment"],
        includes: ["Nail clipping", "Grinding as needed", "Paw check", "Gentle handling", "Optional +$5 add-on"],
        process: ["Book a nail-trim slot", "Share temperament notes", "Complete the trim", "Go home with tidy paws"],
        faqs: [
          { question: "Is grinding included?", answer: "Yes — grinding can be included when it helps keep nails smooth and comfortable." },
          { question: "Can this be added to grooming?", answer: "Yes. Nail care can be booked alone or discussed as part of a grooming visit." }
        ],
        related: ["grooming", "dog-walking", "daycare"],
        featured: true,
        duration: "Quick visit",
        priceLabel: "$28",
        status: "published",
        images: [],
      },
      {
        slug: "behaviour-training",
        name: "Behaviour Training",
        eyebrow: "Positive guidance",
        summary: "training interaction",
        description: "Behaviour-informed training focused on everyday manners, confidence and clear communication — calm practice that helps #petparents and dogs work better together.",
        forWhom: "For dogs and pet parents who want structured support with manners, confidence and everyday cues.",
        benefits: ["Positive behaviour support", "Everyday obedience skills", "Confidence building", "Clear handler communication"],
        includes: ["15-minute training interaction", "Cue practice", "Handler guidance", "Progress notes", "Optional +$5 add-on"],
        process: ["Share training goals", "Book a 15-minute session", "Practice with guided interaction", "Continue at home with notes"],
        faqs: [
          { question: "How long is each session?", answer: "Behaviour training is priced at $23 per 15-minute session." },
          { question: "Do you use positive methods?", answer: "Yes — we focus on calm, positive, behaviour-informed training." }
        ],
        related: ["dog-walking", "daycare", "boarding"],
        featured: true,
        duration: "15 min",
        priceLabel: "$23 / 15 min",
        status: "published",
        images: [],
      },
      {
        slug: "pet-dental-cleaning",
        name: "Pet Dental Cleaning",
        eyebrow: "Fresh breath & healthy teeth",
        summary: "pet dental care",
        description: "Professional teeth brushing and dental care to keep your pet's mouth clean, healthy and fresh — using gentle technique and pet-safe products.",
        forWhom: "Ideal for pet parents who want to maintain their dog's oral hygiene between vet visits.",
        benefits: ["Fresher breath", "Healthier gums and teeth", "Reduced plaque build-up", "Calm, gentle handling"],
        includes: ["Teeth brushing with chosen kit", "Gentle dental handling", "Care notes after session", "Optional +$5 add-on"],
        process: ["Choose your dental kit option", "Book a dental session", "Gentle brushing completed", "Receive after-care notes"],
        faqs: [
          { question: "What kit options are available?", answer: "We offer three options: new toothbrush ($31), dental kit ($45), or your pet's personal toothbrush ($24)." },
          { question: "How often should my dog have dental cleaning?", answer: "Regular brushing is recommended — monthly or more frequent for dogs prone to plaque." }
        ],
        related: ["grooming", "nail-trim", "daycare"],
        featured: true,
        duration: "Quick visit",
        priceLabel: "From $24",
        priceTiers: [
          { label: "Teeth Brushing with new toothbrush", priceLabel: "$31.00" },
          { label: "Teeth Brushing with dental kit", priceLabel: "$45.00" },
          { label: "Teeth Brushing with personal toothbrush", priceLabel: "$24.00" }
        ],
        status: "published",
        images: [],
      }
    ];

    await Service.insertMany(services);
    console.log(`✅ ${services.length} services created`);

    // 3. CREATE BUNDLES
    console.log("📦 Creating bundles...");
    const bundles = [
      {
        slug: "pay-as-you-go-half-day",
        service: "Dog Daycare",
        name: "Pay as you Go",
        priceLabel: "$40",
        duration: "Half Day Play (up to 6 hrs)",
        features: ["Half Day Play (up to 6 hrs)", "Structured Enrichment Activities"],
        featured: false,
        status: "published",
      },
      {
        slug: "pay-as-you-go-full-day",
        service: "Dog Daycare",
        name: "Pay as you Go",
        priceLabel: "$60",
        duration: "Full Day Play (up to 10 hrs)",
        features: ["Full Day Play (up to 10 hrs)", "Structured Enrichment Activities"],
        featured: true,
        status: "published",
      },
      {
        slug: "overnight-boarding",
        service: "Dog Boarding",
        name: "Overnight Boarding",
        priceLabel: "$80",
        duration: "Overnight stay",
        features: ["Boarding from the comfort of home", "Daycare included", "Structured Enrichment Activities"],
        featured: true,
        status: "published",
      },
      {
        slug: "5-half-day-package",
        service: "Dog Daycare",
        name: "5 Half Day Package",
        priceLabel: "$195",
        duration: "Expires 10 days after purchase",
        features: ["5 Half Day (up to 6 hrs) Play", "Package expires 10 days after purchase", "Structured Daycare with Enrichment Activities"],
        featured: false,
        status: "published",
      },
      {
        slug: "5-full-day-package",
        service: "Dog Daycare",
        name: "5 Full Day Package",
        priceLabel: "$270",
        duration: "Expires 10 days after purchase",
        features: ["5 Full Day (up to 10 hrs) Play", "Package expires 10 days after purchase", "Structured Daycare with Enrichment Activities"],
        featured: false,
        status: "published",
      },
      {
        slug: "10-half-day-package",
        service: "Dog Daycare",
        name: "10 Half Day Package",
        priceLabel: "$390",
        duration: "Expires 20 days after purchase",
        features: ["10 Half Day (up to 6 hrs) Play", "Package expires 20 days after purchase", "Structured Daycare with Enrichment Activities"],
        featured: false,
        status: "published",
      },
      {
        slug: "10-full-day-package",
        service: "Dog Daycare",
        name: "10 Full Day Package",
        priceLabel: "$540",
        duration: "Expires 20 days after purchase",
        features: ["10 Full Day (up to 10 hrs) Play", "Package expires 20 days after purchase", "Structured Daycare with Enrichment Activities"],
        featured: false,
        status: "published",
      },
      {
        slug: "20-half-day-package",
        service: "Dog Daycare",
        name: "20 Half Day Package",
        priceLabel: "$780",
        duration: "Expires 40 days after purchase",
        features: ["20 Half Day (up to 6 hrs) Play", "Package expires 40 days after purchase", "Structured Daycare with Enrichment Activities"],
        featured: false,
        status: "published",
      },
      {
        slug: "20-full-day-package",
        service: "Dog Daycare",
        name: "20 Full Day Package",
        priceLabel: "$1,080",
        duration: "Expires 40 days after purchase",
        features: ["20 Full Day (up to 10 hrs) Play", "Package expires 40 days after purchase", "Structured Daycare with Enrichment Activities"],
        featured: false,
        status: "published",
      },
      {
        slug: "28-full-day-package",
        service: "Dog Daycare",
        name: "28 Full Day Package",
        priceLabel: "$1,480",
        duration: "Expires 56 days after purchase",
        features: ["28 Full Day (up to 10 hrs) Play", "Package expires 56 days after purchase", "Structured Daycare with Enrichment Activities"],
        featured: true,
        status: "published",
      }
    ];

    await Bundle.insertMany(bundles);
    console.log(`✅ ${bundles.length} bundles created`);


    // 4. CREATE PRODUCTS
    console.log("🛍️ Creating products...");
    const products = [
      {
        slug: "dog-dad-merch",
        title: "Dog Dad Merch",
        description: "Premium long-sleeve shirt for proud dog dads.",
        priceLabel: "Coming Soon",
        compareAtPriceLabel: "",
        status: "coming-soon",
        images: [],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Forest Green", "Burgundy", "Cream"],
        inventory: 0,
      },
      {
        slug: "dog-mom-merch",
        title: "Dog Mom Merch",
        description: "Premium long-sleeve shirt for proud dog moms.",
        priceLabel: "Coming Soon",
        compareAtPriceLabel: "",
        status: "coming-soon",
        images: [],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Forest Green", "Burgundy", "Cream"],
        inventory: 0,
      },
      {
        slug: "gift-card-150",
        title: "DTdogs Gift Card",
        description: "Premium digital gift card for DTdogs.ca pet care services.",
        priceLabel: "$150",
        compareAtPriceLabel: "",
        status: "published",
        images: [
          {
            id: "gift-card-150-image",
            url: "/images/shop/gift100.png",
            alt: "DTdogs $150 gift card",
            title: "DTdogs $150 gift card",
            order: 1,
          }
        ],
        sizes: [],
        colors: [],
        inventory: 999,
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products created`);

    // 5. CREATE TEAM MEMBERS
    console.log("👥 Creating team members...");
    const team = [
      {
        slug: "sunny",
        name: "Sunny",
        role: "Founder · Sunnyism.Pro #DogDad",
        bio: "Meet Sunnyism.Pro #DogDad — thoughts, vision, and the journey ahead for DTdogs.ca across Downtown Toronto and the GTA.",
        credentials: ["Founder", "GTA Pet Care"],
        image: {
          id: "about-founder",
          url: "/images/about/about-founder.webp",
          alt: "Pet-care professional connecting with a calm dog",
          title: "Founder care portrait",
        },
        instagram: "",
        status: "published",
      },
      {
        slug: "emma",
        name: "Emma",
        role: "Senior Pet Care Specialist",
        bio: "Emma brings over 5 years of professional pet care experience to DTdogs. She specializes in anxious and senior dog care, ensuring every pup feels comfortable and safe during their stay.",
        credentials: ["Pet First Aid Certified", "5+ Years Experience", "Senior Dog Care Specialist"],
        image: {
          id: "pet-visit",
          url: "/images/services/servicespet-visit.webp",
          alt: "Caregiver offering gentle attention during an in-home pet visit",
          title: "In-home pet visit",
        },
        instagram: "",
        status: "published",
      },
      {
        slug: "manu",
        name: "Manu",
        role: "Lead Groomer & Facility Manager",
        bio: "Manu oversees our clean, comfortable facility and provides expert grooming services. His attention to detail and calm handling make every grooming session stress-free for our four-legged clients.",
        credentials: ["Certified Professional Groomer", "Facility Management", "Breed-Specific Styling"],
        image: {
          id: "facility",
          url: "/images/about/facility.webp",
          alt: "Bright clean care environment prepared for pet comfort",
          title: "Clean care environment",
        },
        instagram: "",
        status: "published",
      },
      {
        slug: "pawmily",
        name: "PawMily",
        role: "Toronto",
        bio: "Grooming, walks, sitting services across Toronto.",
        credentials: ["Grooming", "Dog Walking", "Pet Sitting"],
        image: {
          id: "walk-toronto",
          url: "/images/services/serviceswalk-toronto.webp",
          alt: "Dog enjoying a structured neighbourhood walk in Toronto",
          title: "Neighbourhood dog walk",
        },
        instagram: "https://www.instagram.com/pawmily.ca/",
        status: "published",
      },
      {
        slug: "yazz",
        name: "Yazz",
        role: "East Toronto",
        bio: "Professional grooming services in East Toronto.",
        credentials: ["Grooming"],
        image: {
          id: "grooming",
          url: "/images/services/servicesgrooming.webp",
          alt: "Well-groomed dog with a calm confident expression",
          title: "Grooming detail",
        },
        instagram: "https://www.instagram.com/kiss.the.paws/",
        status: "published",
      },
      {
        slug: "suzanne",
        name: "Suzanne",
        role: "West Toronto",
        bio: "Sunny Paws Grooming — professional pet grooming in West Toronto.",
        credentials: ["Grooming"],
        image: {
          id: "grooming-2",
          url: "/images/services/servicesgrooming.webp",
          alt: "Professional grooming services",
          title: "Pet grooming",
        },
        instagram: "https://www.instagram.com/sunny.pawsgrooming/",
        status: "published",
      },
      {
        slug: "shanice",
        name: "Shanice",
        role: "All Over Canada",
        bio: "The Prudent Tooth Fairy — professional teeth cleaning service across Canada.",
        credentials: ["Teeth Cleaning"],
        image: {
          id: "pet-dental",
          url: "/images/services/pet-cleaning.png",
          alt: "Professional pet dental care and teeth brushing",
          title: "Pet dental cleaning",
        },
        instagram: "https://www.instagram.com/theprudenttoothfairy/",
        status: "published",
      },
      {
        slug: "cass",
        name: "Cass",
        role: "Canada",
        bio: "Wagging Through Life — professional pet sitter across Canada.",
        credentials: ["Pet Sitting"],
        image: {
          id: "house-sitting",
          url: "/images/services/serviceshouse-sitting.webp",
          alt: "Dog relaxing in a familiar home environment during house sitting",
          title: "House sitting comfort",
        },
        instagram: "https://www.instagram.com/wagging_through_life/",
        status: "published",
      }
    ];

    await Team.insertMany(team);
    console.log(`✅ ${team.length} team members created`);


    // 6. CREATE FAQs
    console.log("❓ Creating FAQs...");
    const faqs = [
      // General Daycare and Boarding FAQs
      {
        slug: "how-to-get-started",
        question: "How do I get started?",
        answer: "Getting started is easy! Simply browse our services, select the care option that fits your needs, and submit a booking request through our Book Now page. We'll confirm your appointment and guide you through the next steps including any required meet-and-greet or intake information.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 1,
      },
      {
        slug: "how-to-schedule",
        question: "How do I schedule a day of care?",
        answer: "You can schedule care through our online booking system. Select your preferred service, choose your date and time, and provide your pet's information. We'll confirm availability and send you a confirmation email with all the details.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 2,
      },
      {
        slug: "dropoff-pickup-flexibility",
        question: "Is there flexibility to the drop-off and pick-up times?",
        answer: "Yes, we offer flexible drop-off and pick-up windows to accommodate your schedule. Please discuss your specific timing needs when booking, and we'll do our best to accommodate them while ensuring proper care for all pets in our facility.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 3,
      },
      {
        slug: "boarding-overnight",
        question: "Do you offer boarding or overnight care?",
        answer: "Yes! We offer 24/7 boarding services according to city bylaws and confirmed booking arrangements. Your dog will receive overnight supervision, personalized feeding, bathroom support, and comfortable rest routines in a calm, home-style environment.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 4,
      },
      {
        slug: "walking-during-day",
        question: "Will my dog be walked during the day?",
        answer: "Yes, dogs in daycare and boarding receive regular outdoor bathroom breaks and supervised walks as part of their daily routine. We ensure all dogs get appropriate exercise and outdoor enrichment throughout their stay.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 5,
      },
      {
        slug: "minimum-age",
        question: "How old must my dog be to attend?",
        answer: "Dogs must be at least 4 months old and have completed their core vaccinations to attend daycare or boarding. This ensures the safety and health of all pets in our care.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 6,
      },
      {
        slug: "spay-neuter-requirement",
        question: "My dog has not been spayed or neutered. Can I still bring them to daycare?",
        answer: "Dogs over 7 months old must be spayed or neutered to attend daycare. This policy helps maintain a calm, safe social environment for all dogs. Puppies under 7 months are welcome before their spay/neuter procedure.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 7,
      },
      {
        slug: "vaccination-requirement",
        question: "Does my dog need to be vaccinated?",
        answer: "Yes, all dogs must be current on core vaccinations including Rabies, Distemper, and Bordetella (kennel cough). We require proof of vaccination before the first visit to protect all pets in our care.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 8,
      },
      {
        slug: "cancellation-policy",
        question: "What happens if I need to cancel my stay?",
        answer: "We understand plans change. Please review our cancellation policy on our Policy page for details on notice requirements and any applicable fees. Generally, we require 24-48 hours notice for cancellations to avoid charges.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 9,
      },
      {
        slug: "feeding-policy",
        question: "Do you feed the dogs?",
        answer: "Yes, we provide feeding as part of boarding and extended daycare stays. We ask that you bring your dog's regular food to maintain their routine and avoid digestive upset. Please provide clear feeding instructions when booking.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 10,
      },
      {
        slug: "sick-dog-protocol",
        question: "What happens if my dog gets sick at daycare or while being boarded?",
        answer: "If your dog shows signs of illness, we will contact you immediately and follow your emergency contact instructions. We can arrange veterinary care if needed and will keep you informed throughout the process.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 11,
      },
      {
        slug: "group-size",
        question: "How many dogs are usually at daycare?",
        answer: "Group sizes vary based on the day and bookings, but we maintain appropriate staff-to-dog ratios to ensure safe, attentive supervision. Dogs are grouped by size, temperament, and play style for everyone's comfort and safety.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 12,
      },
      {
        slug: "special-care-instructions",
        question: "My dog requires special care. How do you guarantee the instructions are followed properly?",
        answer: "We take detailed intake notes for every dog and maintain clear care instructions in our system. All team members have access to your dog's profile, and we review special care needs during shift handoffs to ensure consistency.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 13,
      },
      {
        slug: "booking-advance-notice",
        question: "How far in advance do I need to book daycare services?",
        answer: "We recommend booking at least 48 hours in advance, especially for weekends and holidays. However, we'll do our best to accommodate last-minute requests based on availability. Contact us to check current openings.",
        category: "General Daycare and Boarding FAQs",
        status: "published",
        order: 14,
      },
      // Dog Grooming FAQs
      {
        slug: "grooming-services-available",
        question: "What grooming services are available?",
        answer: "We offer professional grooming including bath, brush, hygiene tidy, breed-aware styling, and professional finishing. Each grooming session is tailored to your dog's coat type, breed, and comfort level.",
        category: "Dog Grooming FAQs",
        status: "published",
        order: 15,
      },
      {
        slug: "choosing-grooming-package",
        question: "How do I choose the right grooming package?",
        answer: "During booking, share your dog's breed, coat type, and grooming goals. We'll recommend the appropriate services and discuss any specific needs like matting, shedding, or skin sensitivities to create a custom grooming plan.",
        category: "Dog Grooming FAQs",
        status: "published",
        order: 16,
      },
      {
        slug: "grooming-duration",
        question: "How long does grooming take?",
        answer: "Most grooming visits are planned around one focused appointment. Duration depends on coat condition, breed, and services requested — typically 1.5 to 3 hours. We'll provide an estimated time when you book.",
        category: "Dog Grooming FAQs",
        status: "published",
        order: 17,
      },
      {
        slug: "nervous-dogs-grooming",
        question: "Can nervous dogs book grooming?",
        answer: "Absolutely. We use calm, patient handling and can discuss your dog's temperament during booking. We work at your dog's pace and offer breaks as needed to keep the experience positive and stress-free.",
        category: "Dog Grooming FAQs",
        status: "published",
        order: 18,
      },
      {
        slug: "grooming-pricing-confirmation",
        question: "Are grooming prices confirmed before the appointment?",
        answer: "Yes, we provide pricing estimates based on your dog's breed, size, and coat condition during booking. If any additional services are recommended during the appointment, we'll discuss pricing before proceeding.",
        category: "Dog Grooming FAQs",
        status: "published",
        order: 19,
      },
      // Dog Walking FAQs
      {
        slug: "walk-time-options",
        question: "What walk-time options are available?",
        answer: "We offer flexible walk durations to fit your dog's needs and your schedule. Options typically include 20-minute, 30-minute, and 45-minute walks. Discuss your preferences during booking.",
        category: "Dog Walking FAQs",
        status: "published",
        order: 20,
      },
      {
        slug: "solo-walks",
        question: "Do you offer solo walks?",
        answer: "Yes, we offer solo walks for dogs who prefer one-on-one attention or have specific training, behavioral, or health needs that are best met with individual handling.",
        category: "Dog Walking FAQs",
        status: "published",
        order: 21,
      },
      {
        slug: "group-walks",
        question: "Do you offer group walks?",
        answer: "Yes, we offer small group walks for dogs who enjoy socialization. Dogs are carefully matched by size, energy level, and temperament to ensure safe, enjoyable walks for everyone.",
        category: "Dog Walking FAQs",
        status: "published",
        order: 22,
      },
      {
        slug: "walk-service-areas",
        question: "What areas do you serve?",
        answer: "We serve Downtown Toronto and across the Greater Toronto Area (GTA). All walks follow neighbourhood-friendly routes with appropriate outdoor enrichment and bathroom opportunities.",
        category: "Dog Walking FAQs",
        status: "published",
        order: 23,
      },
      {
        slug: "meet-greet-requirement",
        question: "Is a meet-and-greet required before walking?",
        answer: "While not always required, we highly recommend a meet-and-greet for new clients. This allows us to meet your dog, understand their personality and walking preferences, and answer any questions you have about our service.",
        category: "Dog Walking FAQs",
        status: "published",
        order: 24,
      },
      // Booking and Payment FAQs
      {
        slug: "how-to-book",
        question: "How do I book a service?",
        answer: "Visit our Book Now page, select your desired service, choose your date and time, fill in your pet's information, and submit your request. You'll receive a confirmation email with next steps and payment instructions.",
        category: "Booking and Payment FAQs",
        status: "published",
        order: 25,
      },
      {
        slug: "deposit-requirement",
        question: "Is a deposit required?",
        answer: "Deposits may be required for boarding and certain services to secure your booking. Deposit amounts and policies will be clearly communicated during the booking confirmation process.",
        category: "Booking and Payment FAQs",
        status: "published",
        order: 26,
      },
      {
        slug: "gift-card-usage",
        question: "Can I use a gift card?",
        answer: "Yes! DTdogs.ca gift cards can be used for any of our services. Simply provide your gift card code during booking or payment, and we'll apply the balance to your total.",
        category: "Booking and Payment FAQs",
        status: "published",
        order: 27,
      },
      {
        slug: "payment-options",
        question: "What happens if online payment is not configured?",
        answer: "If online payment is unavailable, we accept payment in-store, via Interac e-Transfer, or Amex after confirmation. Payment details will be provided in your booking confirmation email.",
        category: "Booking and Payment FAQs",
        status: "published",
        order: 28,
      },
      {
        slug: "confirmation-email",
        question: "Will I receive a confirmation email?",
        answer: "Yes, you'll receive a confirmation email after submitting your booking request. This email will include your appointment details, payment instructions, and any additional information needed before your visit.",
        category: "Booking and Payment FAQs",
        status: "published",
        order: 29,
      },
      // Health, Safety and Vaccination FAQs
      {
        slug: "required-vaccinations",
        question: "What vaccinations are required?",
        answer: "All dogs must be current on Rabies, Distemper (DHPP), and Bordetella (kennel cough) vaccinations. Proof of vaccination is required before the first visit and must be kept current throughout your time with us.",
        category: "Health, Safety and Vaccination FAQs",
        status: "published",
        order: 30,
      },
      {
        slug: "unwell-pet-protocol",
        question: "What happens if my pet becomes unwell?",
        answer: "If your pet shows signs of illness or injury, we will contact you immediately and follow your emergency instructions. We can arrange veterinary care if authorized and will keep you informed every step of the way.",
        category: "Health, Safety and Vaccination FAQs",
        status: "published",
        order: 31,
      },
      {
        slug: "medical-needs-support",
        question: "Can you support pets with medical needs?",
        answer: "Yes, we can accommodate many medical needs including medication administration, special diets, and mobility support. Please discuss your pet's specific requirements during booking so we can ensure proper care.",
        category: "Health, Safety and Vaccination FAQs",
        status: "published",
        order: 32,
      },
      {
        slug: "transport-information",
        question: "What information is required before transport?",
        answer: "For our pet chauffeur service, we require details about your pet's temperament, any car anxiety or motion sickness, preferred restraint method, and pickup/drop-off locations. Emergency contact information is also required.",
        category: "Health, Safety and Vaccination FAQs",
        status: "published",
        order: 33,
      },
      {
        slug: "safety-measures",
        question: "What safety measures are used during care?",
        answer: "We maintain secure facilities, use proper restraints during transport, supervise all group interactions, follow strict cleaning protocols, require up-to-date vaccinations, and maintain current pet first aid certification for all staff members.",
        category: "Health, Safety and Vaccination FAQs",
        status: "published",
        order: 34,
      },
    ];

    await FAQ.insertMany(faqs);
    console.log(`✅ ${faqs.length} FAQs created`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log("- 1 Admin user");
    console.log(`- ${services.length} Services`);
    console.log(`- ${bundles.length} Bundles`);
    console.log(`- ${products.length} Products`);
    console.log(`- ${team.length} Team members`);
    console.log(`- ${faqs.length} FAQs`);
    
    console.log("\n🔐 Admin Login:");
    console.log("Email: admin@dtdogs.ca");
    console.log("Password: Admin@12345");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedData();
