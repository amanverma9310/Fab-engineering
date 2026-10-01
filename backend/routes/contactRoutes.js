const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimiters");
const {
  honeypotCheck,
  disposableEmailCheck,
  contentSpamCheck,
  emailRateLimit,
} = require("../middleware/spamProtection");

const router = express.Router();

// Indian mobile number validation: 10 digits starting with 6-9
const indianPhoneRegex = /^[6-9]\d{9}$/;

function normalizeIndianPhone(phone) {
  if (!phone) return phone;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }).withMessage("Name too long"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 150 }).withMessage("Subject too long"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
  body("phone")
    .optional({ nullable: true })
    .trim()
    .custom((value) => {
      if (!value || value.trim() === "") return true;
      const normalized = normalizeIndianPhone(value);
      if (!indianPhoneRegex.test(normalized)) {
        throw new Error("Phone must be a valid 10-digit Indian mobile number");
      }
      return true;
    }),
  body("service").optional().trim().isLength({ max: 100 }).withMessage("Service too long"),
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
  contactLimiter,
  emailRateLimit,
  honeypotCheck,
  disposableEmailCheck,
  contentSpamCheck,
  contactValidation,
  validate,
  createContact
);

router.get("/", protect, getContacts);
router.get("/:id", protect, getContactById);
router.put("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;
