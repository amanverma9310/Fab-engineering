const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const IMAGE_TYPES = /jpeg|jpg|png|webp|gif/;
const DOCUMENT_TYPES = /jpeg|jpg|png|pdf|dxf|dwg|zip/;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ATTACHMENT_SIZE = 15 * 1024 * 1024; // 15MB

function localStorage(folder) {
  const dest = path.join(__dirname, "..", "uploads", folder);
  fs.mkdirSync(dest, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

function cloudinaryStorage(folder) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `fab-engineering/${folder}`,
      resource_type: "auto", // allows PDFs/DXF/etc alongside images
    },
  });
}

function fileFilterFor(allowedPattern) {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const mimetypeOk = file.mimetype.startsWith("image/") || allowedPattern.test(ext);
    const extOk = allowedPattern.test(ext);
    if (extOk || mimetypeOk) return cb(null, true);
    cb(new Error(`Unsupported file type: ${ext || file.mimetype}`));
  };
}

/**
 * Creates a configured multer instance for a given upload folder.
 * @param {string} folder - "products" | "gallery" | "projects" | "settings" | "inquiries"
 * @param {"images"|"documents"} kind
 */
function createUploader(folder, kind = "images") {
  const storage = isCloudinaryConfigured() ? cloudinaryStorage(folder) : localStorage(folder);
  const allowed = kind === "documents" ? DOCUMENT_TYPES : IMAGE_TYPES;
  const limits = {
    fileSize: kind === "documents" ? MAX_ATTACHMENT_SIZE : MAX_IMAGE_SIZE,
    files: kind === "documents" ? 5 : 10,
  };

  return multer({ storage, fileFilter: fileFilterFor(allowed), limits });
}

// Turns whatever multer/Cloudinary gives back into a plain { url, filename... }
// shape the controllers can push straight into Mongoose arrays.
function normalizeUploadedFile(file) {
  if (isCloudinaryConfigured()) {
    return { url: file.path, filename: file.originalname, mimetype: file.mimetype, size: file.size };
  }
  return {
    url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  };
}

module.exports = { createUploader, normalizeUploadedFile, isCloudinaryConfigured };
