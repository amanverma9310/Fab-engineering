const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: { type: String },
    size: { type: Number },
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    // Human-friendly reference shown in the admin table and any confirmation
    // email, independent of the Mongo _id.
    inquiryId: { type: String, required: true, unique: true, index: true },

    customerName: { type: String, required: true, trim: true, maxlength: 100 },
    companyName: { type: String, trim: true, maxlength: 150 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },

    // Linked product/service, if the inquiry started from a product page.
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    service: { type: String, trim: true }, // free-text service name/snapshot, kept even if the product is later edited/deleted

    quantity: { type: Number, min: 0 },
    material: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 5000 },
    projectDetails: { type: String, trim: true, maxlength: 5000 },
    expectedDate: { type: Date },
    address: { type: String, trim: true, maxlength: 500 },
    attachments: { type: [attachmentSchema], default: [] },

    // Where this inquiry originated — lets one model back the product-page
    // inquiry form, the general quote page, and admin reporting alike.
    source: {
      type: String,
      enum: ["product_page", "quote_page", "general"],
      default: "general",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Reviewing",
        "Contacted",
        "Quoted",
        "Approved",
        "In Progress",
        "Completed",
        "Rejected",
      ],
      default: "New",
      index: true,
    },
    adminNotes: { type: String, trim: true, maxlength: 3000 },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ customerName: "text", email: "text", phone: "text", service: "text" });

module.exports = mongoose.model("Inquiry", inquirySchema);
