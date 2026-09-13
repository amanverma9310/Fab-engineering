const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "FAB Engineering" },
    logo: { type: String, default: "" }, // uploaded logo URL; falls back to the built-in mark if blank
    phone: { type: String, default: "93115 75271" },
    whatsapp: { type: String, default: "+91 78178 27362" },
    email: { type: String, default: "abhiverma9315@gmail.com" },
    address: { type: String, default: "Tughlakabad Gaun, Delhi" },

    heroHeading: { type: String, default: "Precision Engineering. Built to Perform." },
    heroText: {
      type: String,
      default:
        "Laser cutting, sheet metal fabrication, bending and custom manufacturing for teams that need dependable results.",
    },
    aboutContent: {
      type: String,
      default:
        "FAB Engineering provides mechanical design, laser cutting, sheet metal fabrication, bending, powder coating and custom engineering solutions from Tughlakabad Sarai, Delhi.",
    },

    businessHours: { type: String, default: "Mon – Sat, 9:00 AM – 7:00 PM" },

    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    footerText: {
      type: String,
      default: "Precision fabrication and practical engineering for the parts that keep business moving.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
