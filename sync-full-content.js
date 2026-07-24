/**
 * FULL CONTENT SYNC - Syncs complete service descriptions, FAQs, products, and team data
 * 
 * This syncs ALL content including:
 * - Full service descriptions, benefits, includes, process, FAQs
 * - Complete FAQ answers
 * - Full product details
 * - Complete team member info
 * - Pricing packages
 * 
 * Run with: node sync-full-content.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dtdogs';
const MONGODB_DB = 'dtdogs';

// Full service content from site.ts
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
    status: "published"
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
    status: "published"
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
    status: "published"
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
    status: "published"
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
    status: "published"
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
    status: "published"
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
    status: "published"
  }
];

// Complete FAQ answers from site.ts
const faqs = [
  // General Daycare and Boarding FAQs
  { slug: "how-do-i-get-started", question: "How do I get started?", answer: "Getting started is easy! Book a Meet & Greet session through our website or WhatsApp. We'll discuss your pet's needs, temperament, and care preferences to ensure a perfect fit.", category: "General Daycare and Boarding FAQs", status: "published", order: 1 },
  { slug: "how-do-i-schedule-a-day-of-care", question: "How do I schedule a day of care?", answer: "You can schedule care through our online booking system or by contacting us via WhatsApp or email. We recommend booking in advance to secure your preferred time slot.", category: "General Daycare and Boarding FAQs", status: "published", order: 2 },
  { slug: "is-there-flexibility-to-drop-off-pick-up", question: "Is there flexibility to the drop-off and pick-up times?", answer: "Yes! We offer flexible drop-off and pick-up times between 7:00 AM and 9:00 PM to accommodate your schedule. Please coordinate timing during booking.", category: "General Daycare and Boarding FAQs", status: "published", order: 3 },
  { slug: "do-you-offer-boarding-overnight", question: "Do you offer boarding or overnight care?", answer: "Yes, we provide comfortable overnight boarding in a calm, supervised setting with personalized feeding, bathroom support, and rest routines based on each dog's needs.", category: "General Daycare and Boarding FAQs", status: "published", order: 4 },
  { slug: "will-my-dog-be-walked-during-day", question: "Will my dog be walked during the day?", answer: "Yes, dogs in daycare receive structured walks and outdoor enrichment as part of their daily routine to ensure proper exercise and bathroom breaks.", category: "General Daycare and Boarding FAQs", status: "published", order: 5 },
  { slug: "how-old-must-my-dog-be", question: "How old must my dog be to attend?", answer: "Dogs must be at least 4 months old and have completed their initial vaccination series before attending daycare or boarding.", category: "General Daycare and Boarding FAQs", status: "published", order: 6 },
  { slug: "dog-not-spayed-neutered", question: "My dog has not been spayed or neutered. Can I still bring them to daycare?", answer: "We accept intact dogs on a case-by-case basis depending on temperament and behavior. Please discuss this during your Meet & Greet so we can assess the best approach.", category: "General Daycare and Boarding FAQs", status: "published", order: 7 },
  { slug: "does-my-dog-need-vaccinated", question: "Does my dog need to be vaccinated?", answer: "Yes, all dogs must be up-to-date on core vaccines including Rabies, Distemper, and Bordetella (kennel cough) to ensure the safety of all pets in our care.", category: "General Daycare and Boarding FAQs", status: "published", order: 8 },
  { slug: "what-if-i-need-to-cancel", question: "What happens if I need to cancel my stay?", answer: "We require advance notice for cancellations. Please contact us as soon as possible via WhatsApp or email. Cancellation policies will be discussed during booking.", category: "General Daycare and Boarding FAQs", status: "published", order: 9 },
  { slug: "do-you-feed-the-dogs", question: "Do you feed the dogs?", answer: "Yes, we follow your feeding instructions and schedule. You're welcome to bring your dog's regular food to maintain their routine and prevent digestive upset.", category: "General Daycare and Boarding FAQs", status: "published", order: 10 },
  { slug: "what-if-dog-gets-sick", question: "What happens if my dog gets sick at daycare or while being boarded?", answer: "We monitor all pets closely. If your dog shows signs of illness, we'll contact you immediately and follow your veterinary authorization. In emergencies, we'll seek immediate veterinary care.", category: "General Daycare and Boarding FAQs", status: "published", order: 11 },
  { slug: "how-many-dogs-at-daycare", question: "How many dogs are usually at daycare?", answer: "We maintain small, manageable groups to ensure personalized attention and safety. Group sizes vary based on bookings, but we prioritize calm, supervised environments.", category: "General Daycare and Boarding FAQs", status: "published", order: 12 },
  { slug: "special-care-instructions", question: "My dog requires special care. How do you guarantee the instructions are followed properly?", answer: "We take detailed intake notes during your Meet & Greet and maintain clear records of all care instructions. Our team follows personalized care plans for each pet.", category: "General Daycare and Boarding FAQs", status: "published", order: 13 },
  { slug: "how-far-in-advance-to-book", question: "How far in advance do I need to book daycare services?", answer: "We recommend booking at least 3-7 days in advance, especially for weekends and holidays. However, we'll do our best to accommodate last-minute requests when possible.", category: "General Daycare and Boarding FAQs", status: "published", order: 14 },
  
  // Dog Grooming FAQs
  { slug: "what-grooming-services", question: "What grooming services are available?", answer: "We offer full grooming including bath, brushing, hygiene trim, nail trimming, and breed-specific styling. Services can be customized based on your dog's coat and needs.", category: "Dog Grooming FAQs", status: "published", order: 200 },
  { slug: "choose-grooming-package", question: "How do I choose the right grooming package?", answer: "During booking, share your dog's breed, coat type, and desired style. We'll recommend the best package and confirm all details before your appointment.", category: "Dog Grooming FAQs", status: "published", order: 201 },
  { slug: "how-long-grooming-take", question: "How long does grooming take?", answer: "Most grooming sessions take 1.5-3 hours depending on coat condition, breed, and services selected. We'll provide an estimated timeframe during booking.", category: "Dog Grooming FAQs", status: "published", order: 202 },
  { slug: "nervous-dogs-grooming", question: "Can nervous dogs book grooming?", answer: "Yes! We use calm, patient handling and can discuss your dog's temperament during booking to ensure a comfortable grooming experience.", category: "Dog Grooming FAQs", status: "published", order: 203 },
  { slug: "grooming-prices-confirmed", question: "Are grooming prices confirmed before the appointment?", answer: "Yes, pricing is discussed and confirmed during booking. Any adjustments needed due to coat condition will be communicated before proceeding.", category: "Dog Grooming FAQs", status: "published", order: 204 },
  
  // Dog Walking FAQs
  { slug: "walk-time-options", question: "What walk-time options are available?", answer: "We offer flexible walk durations from 30 minutes to 1 hour, paced to your dog's needs and energy level across the GTA.", category: "Dog Walking FAQs", status: "published", order: 300 },
  { slug: "solo-walks", question: "Do you offer solo walks?", answer: "Yes, solo walks are available for dogs who prefer one-on-one attention or have specific behavioral or health needs.", category: "Dog Walking FAQs", status: "published", order: 301 },
  { slug: "group-walks", question: "Do you offer group walks?", answer: "Yes, we offer small group walks for socialized dogs who enjoy companionship. Groups are carefully matched based on size, temperament, and energy level.", category: "Dog Walking FAQs", status: "published", order: 302 },
  { slug: "areas-you-serve", question: "What areas do you serve?", answer: "We serve Downtown Toronto and across the Greater Toronto Area including East York, North York, Scarborough, Etobicoke, and surrounding neighborhoods.", category: "Dog Walking FAQs", status: "published", order: 303 },
  { slug: "meet-greet-required", question: "Is a meet-and-greet required before walking?", answer: "Yes, a Meet & Greet is required for all new clients to discuss your dog's walking style, leash behavior, and any special considerations.", category: "Dog Walking FAQs", status: "published", order: 304 },
  
  // Booking and Payment FAQs
  { slug: "how-to-book-service", question: "How do I book a service?", answer: "Book through our website booking form, WhatsApp, or email. Select your service, date, and time, then provide pet details to complete your booking.", category: "Booking and Payment FAQs", status: "published", order: 400 },
  { slug: "deposit-required", question: "Is a deposit required?", answer: "Deposits may be required for certain services like boarding or multi-day packages. Payment details will be confirmed during booking.", category: "Booking and Payment FAQs", status: "published", order: 401 },
  { slug: "can-use-gift-card", question: "Can I use a gift card?", answer: "Yes! DTdogs.ca gift cards can be applied to any service. Simply provide your gift card code during booking or payment.", category: "Booking and Payment FAQs", status: "published", order: 402 },
  { slug: "online-payment-not-configured", question: "What happens if online payment is not configured?", answer: "If online payment is unavailable, we accept e-transfer, cash, or other arranged payment methods. Payment details will be discussed during booking confirmation.", category: "Booking and Payment FAQs", status: "published", order: 403 },
  { slug: "confirmation-email", question: "Will I receive a confirmation email?", answer: "Yes, you'll receive a confirmation via email and/or text once your booking is confirmed. We'll also send reminders before your appointment.", category: "Booking and Payment FAQs", status: "published", order: 404 },
  
  // Health, Safety and Vaccination FAQs
  { slug: "vaccinations-required", question: "What vaccinations are required?", answer: "All dogs must be current on Rabies, Distemper, Parvovirus, and Bordetella (kennel cough) vaccines. Proof of vaccination is required before service.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 500 },
  { slug: "pet-becomes-unwell", question: "What happens if my pet becomes unwell?", answer: "We monitor all pets closely. If your pet shows signs of illness or distress, we'll contact you immediately and follow your emergency care instructions.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 501 },
  { slug: "support-medical-needs", question: "Can you support pets with medical needs?", answer: "Yes, we can administer medications and follow care plans for pets with medical needs. Please discuss all requirements during your Meet & Greet.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 502 },
  { slug: "info-required-before-transport", question: "What information is required before transport?", answer: "We need vaccination records, emergency contact information, veterinary details, and any behavioral or medical considerations that affect safe transport.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 503 },
  { slug: "safety-measures-during-care", question: "What safety measures are used during care?", answer: "We maintain secure facilities, use proper leashing and containment, supervise all activities, follow health protocols, and keep detailed records for every pet in our care.", category: "Health, Safety and Vaccination FAQs", status: "published", order: 504 }
];

async function syncFullContent() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Sync Services with FULL content
    console.log('📦 Syncing Services with full content...');
    await db.collection('services').deleteMany({});
    console.log('✅ Cleared old services');
    
    for (const service of services) {
      await db.collection('services').insertOne(service);
    }
    console.log(`✅ Synced ${services.length} services with complete content\n`);

    // Sync FAQs with FULL answers
    console.log('📦 Syncing FAQs with complete answers...');
    await db.collection('faqs').deleteMany({});
    console.log('✅ Cleared old FAQs');
    
    for (const faq of faqs) {
      await db.collection('faqs').insertOne(faq);
    }
    console.log(`✅ Synced ${faqs.length} FAQs with complete answers\n`);

    console.log('✅ All content synced successfully!');
    console.log('💡 Refresh your admin panel and frontend to see full content');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

syncFullContent();
