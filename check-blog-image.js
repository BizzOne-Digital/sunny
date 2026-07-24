const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017/dtdogs";

async function checkBlogImage() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db();
    const collection = db.collection("blogposts");

    const posts = await collection.find({}).toArray();
    
    console.log(`📊 Found ${posts.length} blog post(s)\n`);

    posts.forEach((post, index) => {
      console.log(`\n📝 Post ${index + 1}: ${post.title || post.slug}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Status: ${post.status}`);
      
      if (post.featuredImage) {
        console.log(`   Featured Image:`);
        console.log(`      Title: ${post.featuredImage.title || 'N/A'}`);
        console.log(`      URL: ${post.featuredImage.url || 'MISSING'}`);
        console.log(`      Alt: ${post.featuredImage.alt || 'N/A'}`);
        
        // Check if URL is valid
        if (post.featuredImage.url) {
          const url = post.featuredImage.url;
          if (url.startsWith('http://') || url.startsWith('https://')) {
            console.log(`      ✅ URL is absolute`);
          } else {
            console.log(`      ⚠️  URL is relative: ${url}`);
          }
          
          // Check if has extension
          const hasExtension = /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
          if (hasExtension) {
            console.log(`      ✅ Has file extension`);
          } else {
            console.log(`      ⚠️  Missing file extension (might still work)`);
          }
        } else {
          console.log(`      ❌ URL is empty!`);
        }
      } else {
        console.log(`   ❌ No featured image object`);
      }
    });

    console.log('\n\n💡 Next Steps:');
    console.log('1. Check browser console for image loading errors');
    console.log('2. Try opening the image URL directly in browser');
    console.log('3. Make sure dev server is restarted after changes');
    console.log('4. Hard refresh page (Ctrl+Shift+R)');

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

checkBlogImage();
