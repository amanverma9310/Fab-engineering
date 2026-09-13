const express = require("express");
const { body } = require("express-validator");
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];

router.post("/", contactLimiter, contactValidation, createContact);

router.get("/", protect, getContacts);
router.get("/:id", protect, getContactById);
router.put("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;
