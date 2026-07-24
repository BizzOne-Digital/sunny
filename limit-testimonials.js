const { MongoClient } = require('mongodb');

async function limitTestimonials() {
  const uri = 'mongodb://127.0.0.1:27017/dtdogs';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('dtdogs');
    
    // Get all testimonials, sorted by creation date
    const testimonials = await db.collection('testimonials')
      .find({ status: 'published' })
      .sort({ createdAt: 1 })
      .toArray();
    
    console.log(`Found ${testimonials.length} published testimonials`);
    
    if (testimonials.length > 11) {
      // Keep only the first 11, delete the rest
      const toKeep = testimonials.slice(0, 11).map(t => t._id);
      const toDelete = testimonials.slice(11).map(t => t._id);
      
      const result = await db.collection('testimonials').deleteMany({
        _id: { $in: toDelete }
      });
      
      console.log(`Kept 11 testimonials, deleted ${result.deletedCount} testimonials`);
    } else {
      console.log(`Only ${testimonials.length} testimonials found, no need to delete any`);
    }

    console.log('\n✅ Done! Restart your dev server.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

limitTestimonials();
