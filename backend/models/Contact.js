const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    service: { type: String, trim: true }, // optional "service of interest"
    status: { type: String, enum: ["New", "Read", "Replied"], default: "New", index: true },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ name: "text", email: "text", subject: "text" });

module.exports = mongoose.model("Contact", contactSchema);
