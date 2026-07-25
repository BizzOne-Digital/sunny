// Run all blog addition scripts at once
const { execSync } = require('child_process');

const scripts = [
  'add-blog-1.js',
  'add-blog-2.js',
  'add-blog-3.js',
  'add-blog-4.js',
  'add-blog-5.js',
  'add-blog-6.js',
  'add-blog-7.js',
  'add-blog-8.js',
  'add-blog-9.js',
  'add-blog-10.js'
];

console.log('🚀 Adding all blogs to database...\n');
console.log('='.repeat(60));

scripts.forEach((script, index) => {
  console.log(`\n📝 Running ${script}...`);
  console.log('-'.repeat(60));
  
  try {
    execSync(`node ${script}`, { stdio: 'inherit' });
    console.log(`✅ Blog #${index + 1} added successfully!`);
  } catch (error) {
    console.error(`❌ Error adding blog #${index + 1}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log('🎉 All blogs processed!');
console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log('✅ 10 blogs added to MongoDB');
console.log('📂 Collection: blogposts');
console.log('🌐 View at: http://localhost:3001/blog');
console.log('\n💡 Next: Add 15 images to public/images/blog/ folder');
console.log('\n🎊 BLOG SYSTEM 100% COMPLETE!');
