const asyncHandler = require("express-async-handler");
const Gallery = require("../models/Gallery");
const { normalizeUploadedFile } = require("../utils/upload");

const getGallery = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};
  const images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: images });
});

// @route  POST /api/gallery (multipart/form-data, field name "images") — supports multi-upload
const addGalleryImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    res.status(400);
    throw new Error("At least one image is required");
  }

  const { caption, category } = req.body;
  const docs = await Gallery.insertMany(
    req.files.map((f) => ({ image: normalizeUploadedFile(f).url, caption, category }))
  );
  res.status(201).json({ success: true, data: docs });
});

const updateGalleryImage = asyncHandler(async (req, res) => {
  const { caption, category, order } = req.body;
  const image = await Gallery.findByIdAndUpdate(
    req.params.id,
    { ...(caption !== undefined && { caption }), ...(category !== undefined && { category }), ...(order !== undefined && { order }) },
    { new: true, runValidators: true }
  );
  if (!image) {
    res.status(404);
    throw new Error("Gallery image not found");
  }
  res.json({ success: true, data: image });
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Gallery image not found");
  }
  res.json({ success: true, message: "Image deleted" });
});

module.exports = { getGallery, addGalleryImages, updateGalleryImage, deleteGalleryImage };
