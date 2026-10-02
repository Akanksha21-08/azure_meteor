const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let storage;

if (isCloudinaryConfigured()) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
      const isPdfOrDoc = ['pdf', 'doc', 'docx'].includes(ext);
      return {
        folder: 'jobverse_uploads',
        resource_type: isPdfOrDoc ? 'raw' : 'auto',
        public_id: file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E6)
      };
    }
  });
} else {
  storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadsDir);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
}

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /pdf|doc|docx|png|jpg|jpeg/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (allowedExtensions.test(ext)) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, PNG, JPG, and JPEG files are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

module.exports = upload;
