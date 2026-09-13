const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    caption: { type: String, trim: true, maxlength: 200 },
    category: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
