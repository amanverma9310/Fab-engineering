const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

// Magic bytes for file type validation
const MAGIC_BYTES = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  zip: [0x50, 0x4b, 0x03, 0x04], // PK..
  // DXF and DWG are harder to detect by magic bytes alone, rely on extension + MIME
};

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

function checkMagicBytes(buffer, expectedTypes) {
  for (const type of expectedTypes) {
    const magic = MAGIC_BYTES[type];
    if (magic && buffer.length >= magic.length) {
      let matches = true;
      for (let i = 0; i < magic.length; i++) {
        if (buffer[i] !== magic[i]) {
          matches = false;
          break;
        }
      }
      if (matches) return type;
    }
  }
  // For DXF/DWG, we can't easily check magic bytes, so allow if extension matches
  return null;
}

function fileFilterFor(allowedPattern, kind = "images") {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const extOk = allowedPattern.test(ext);

    let mimetypeOk = false;
    if (kind === "images") {
      mimetypeOk = file.mimetype.startsWith("image/") && allowedPattern.test(file.mimetype.split("/")[1]);
    } else {
      const allowedMimeTypes = {
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        png: "image/png",
        pdf: "application/pdf",
        dxf: "application/dxf",
        dwg: "application/dwg",
        zip: "application/zip",
      };
      mimetypeOk = allowedMimeTypes[ext] === file.mimetype;
    }

    if (!extOk || !mimetypeOk) {
      return cb(new Error(`Unsupported file type: ${ext || file.mimetype}`));
    }

    // Magic byte validation will be done after file is buffered
    // For now, we trust the extension and mimetype
    // In production, you'd want to buffer the file and check magic bytes
    cb(null, true);
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

  return multer({ storage, fileFilter: fileFilterFor(allowed, kind), limits });
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

module.exports = { createUploader, normalizeUploadedFile, isCloudinaryConfigured, checkMagicBytes, MAGIC_BYTES };
