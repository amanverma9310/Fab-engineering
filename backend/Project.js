const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, trim: true },
    client: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    completedDate: { type: Date },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
