const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema(
  { key: { type: String, required: true, trim: true }, value: { type: String, required: true, trim: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, trim: true },
    // Optional — most engineering services here are quote-based rather than fixed-price.
    price: { type: Number, min: 0 },
    images: { type: [String], default: [] }, // Cloudinary URLs or /uploads/... paths
    specifications: { type: [specificationSchema], default: [] },
    features: { type: [String], default: [] },
    serviceType: { type: String, trim: true }, // e.g. "Laser Cutting", "Sheet Metal Fabrication"
    isActive: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", shortDescription: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
