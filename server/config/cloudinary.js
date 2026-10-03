const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return false;
  if (cloudName.includes('dummy') || cloudName.includes('your_')) return false;
  if (apiKey.includes('dummy') || apiKey.includes('your_')) return false;
  if (apiSecret.includes('dummy') || apiSecret.includes('your_')) return false;

  return true;
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary storage initialized for cloud file uploads.');
} else {
  console.info('Cloudinary credentials not configured or set to dummy. Using local disk uploads fallback (/uploads).');
}

module.exports = { cloudinary, isCloudinaryConfigured };
