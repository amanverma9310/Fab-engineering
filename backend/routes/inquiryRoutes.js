const express = require("express");
const { body } = require("express-validator");
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  updateInquiryStatus,
  deleteInquiry,
} = require("../controllers/inquiryController");
const { protect } = require("../middleware/auth");
const { inquiryLimiter } = require("../middleware/rateLimiters");
const { createUploader } = require("../utils/upload");

const router = express.Router();
const upload = createUploader("inquiries", "documents");

const inquiryValidation = [
  body("customerName").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
];

router.post("/", inquiryLimiter, upload.array("attachments", 5), inquiryValidation, createInquiry);

router.get("/", protect, getInquiries);
router.get("/:id", protect, getInquiryById);
router.put("/:id", protect, updateInquiry);
router.put("/:id/status", protect, updateInquiryStatus);
router.delete("/:id", protect, deleteInquiry);

module.exports = router;
