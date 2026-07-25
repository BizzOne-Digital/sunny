const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/dtdogs";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const teamSchema = new mongoose.Schema({
  slug: String,
  name: String,
  role: String,
  bio: String,
  credentials: [String],
  image: Object,
  instagram: String,
  status: String,
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);

async function fixTeamMembers() {
  try {
    console.log("👥 Fixing team member bios...");

    // Emma - Senior Pet Care Specialist
    await Team.findOneAndUpdate(
      { slug: "emma" },
      {
        $set: {
          role: "Senior Pet Care Specialist",
          bio: "Emma brings over 5 years of professional pet care experience to DTdogs. She specializes in anxious and senior dog care, ensuring every pup feels comfortable and safe during their stay.",
          credentials: ["Pet First Aid Certified", "5+ Years Experience", "Senior Dog Care Specialist"],
        }
      }
    );
    console.log("✅ Emma's profile updated");

    // Manu - Lead Groomer & Facility Manager
    await Team.findOneAndUpdate(
      { slug: "manu" },
      {
        $set: {
          role: "Lead Groomer & Facility Manager",
          bio: "Manu oversees our clean, comfortable facility and provides expert grooming services. His attention to detail and calm handling make every grooming session stress-free for our four-legged clients.",
          credentials: ["Certified Professional Groomer", "Facility Management", "Breed-Specific Styling"],
        }
      }
    );
    console.log("✅ Manu's profile updated");

    console.log("\n🎉 Team member profiles fixed!");
    
    // Show updated team
    const team = await Team.find({ slug: { $in: ["emma", "manu"] } });
    console.log("\n👥 Updated Team Members:");
    team.forEach(member => {
      console.log(`\n${member.name} - ${member.role}`);
      console.log(`Bio: ${member.bio.substring(0, 80)}...`);
      console.log(`Credentials: ${member.credentials.join(", ")}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
}

fixTeamMembers();
