const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, required: true, trim: true, maxlength: 100 }, // e.g. "CEO", "Co-Founder"
    photo: { type: String, required: true }, // Cloudinary URL or local /uploads path
    bio: { type: String, trim: true, maxlength: 500 },
    linkedin: { type: String, trim: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
