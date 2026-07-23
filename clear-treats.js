const { MongoClient } = require('mongodb');

async function clearTreatsData() {
  const uri = 'mongodb://127.0.0.1:27017/dtdogs';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('dtdogs');
    
    // Delete all treats page images from media collection
    const mediaResult = await db.collection('media').deleteMany({ page: 'treats' });
    console.log(`Deleted ${mediaResult.deletedCount} treats images from media collection`);

    // Update the treats page to remove blocks with images
    const pagesResult = await db.collection('pages').updateOne(
      { slug: 'treats' },
      { $set: { blocks: [] } }
    );
    console.log(`Updated treats page, modified ${pagesResult.modifiedCount} document(s)`);

    console.log('\n✅ Treats data cleared! Now restart your dev server.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

clearTreatsData();
