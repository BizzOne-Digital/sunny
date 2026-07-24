const { v2: cloudinary } = require('cloudinary');

// Manual credentials from .env.local
const cloudName = 'dpp3nig3n';
const apiKey = '275369625591224';
const apiSecret = '9YrkwzWYWgW5lrkzrrLZ7Z6UcAw';

console.log('📋 Cloudinary Configuration:');
console.log('Cloud Name:', cloudName);
console.log('API Key:', apiKey);
console.log('API Secret:', '***' + apiSecret.slice(-4));

// Configure
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Test API access
console.log('\n🔍 Testing Cloudinary API access...');

cloudinary.api.ping()
  .then((result) => {
    console.log('✅ Cloudinary API is accessible!');
    console.log('Status:', result.status);
    
    // Try to get account info
    return cloudinary.api.usage();
  })
  .then((usage) => {
    console.log('\n📊 Account Usage:');
    console.log('Credits used:', usage.credits?.usage || 'N/A');
    console.log('Credits limit:', usage.credits?.limit || 'N/A');
    console.log('Storage used:', usage.storage?.usage || 'N/A');
    console.log('\n✅ All tests passed! Cloudinary is properly configured.');
  })
  .catch((error) => {
    console.error('\n❌ Cloudinary API Error:');
    console.error('Status:', error.http_code);
    console.error('Message:', error.message);
    console.error('Error:', error.error?.message || error);
    
    if (error.http_code === 403) {
      console.log('\n💡 403 Error means:');
      console.log('1. API Secret might be wrong');
      console.log('2. API Key might be wrong');
      console.log('3. Account might be suspended');
      console.log('\n🔧 Please verify credentials at:');
      console.log('https://console.cloudinary.com/settings/api-keys');
    }
    
    process.exit(1);
  });
