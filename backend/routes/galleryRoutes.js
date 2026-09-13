const express = require("express");
const {
  getGallery,
  addGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const { createUploader } = require("../utils/upload");

const router = express.Router();
const upload = createUploader("gallery", "images");

router.get("/", getGallery);

router.post("/", protect, upload.array("images", 10), addGalleryImages);
router.put("/:id", protect, updateGalleryImage);
router.delete("/:id", protect, deleteGalleryImage);

module.exports = router;
