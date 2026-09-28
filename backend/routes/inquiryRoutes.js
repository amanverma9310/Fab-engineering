const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
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
const {
  honeypotCheck,
  disposableEmailCheck,
  contentSpamCheck,
  emailRateLimit,
} = require("../middleware/spamProtection");

const router = express.Router();
const upload = createUploader("inquiries", "documents");

const inquiryValidation = [
  body("customerName").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }).withMessage("Name too long"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Phone number is required").isLength({ max: 30 }).withMessage("Phone too long"),
  body("companyName").optional().trim().isLength({ max: 150 }).withMessage("Company name too long"),
  body("whatsapp").optional().trim().isLength({ max: 30 }).withMessage("WhatsApp too long"),
  body("service").optional().trim().isLength({ max: 150 }).withMessage("Service too long"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a positive number"),
  body("material").optional().trim().isLength({ max: 100 }).withMessage("Material too long"),
  body("description").optional().trim().isLength({ max: 5000 }).withMessage("Description too long"),
  body("projectDetails").optional().trim().isLength({ max: 5000 }).withMessage("Project details too long"),
  body("address").optional().trim().isLength({ max: 500 }).withMessage("Address too long"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

router.post(
  "/",
  inquiryLimiter,
  emailRateLimit,
  honeypotCheck,
  disposableEmailCheck,
  contentSpamCheck,
  upload.array("attachments", 5),
  inquiryValidation,
  validate,
  createInquiry
);

router.get("/", protect, getInquiries);
router.get("/:id", protect, getInquiryById);
router.put("/:id", protect, updateInquiry);
router.put("/:id/status", protect, updateInquiryStatus);
router.delete("/:id", protect, deleteInquiry);

module.exports = router;
