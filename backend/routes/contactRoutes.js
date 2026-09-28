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

const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }).withMessage("Name too long"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 150 }).withMessage("Subject too long"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
  body("phone").optional().trim().isLength({ max: 30 }).withMessage("Phone too long"),
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
