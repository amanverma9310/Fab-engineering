const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, optionalAuth } = require("../middleware/auth");
const { createUploader } = require("../utils/upload");

const router = express.Router();
const upload = createUploader("products", "images");

const productValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 150 }).withMessage("Name must be at most 150 characters"),
  body("category").trim().notEmpty().withMessage("Category is required").isLength({ max: 100 }).withMessage("Category must be at most 100 characters"),
  body("shortDescription").trim().notEmpty().withMessage("Short description is required").isLength({ max: 500 }).withMessage("Short description must be at most 500 characters"),
  body("description").trim().notEmpty().withMessage("Description is required").isLength({ max: 5000 }).withMessage("Description must be at most 5000 characters"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("unit").optional().trim().isLength({ max: 50 }).withMessage("Unit must be at most 50 characters"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  body("featured").optional().isBoolean().withMessage("featured must be a boolean"),
  body("order").optional().isInt({ min: 0 }).withMessage("Order must be a non-negative integer"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }
  next();
};

router.get("/", optionalAuth, getProducts);
router.get("/:slug", optionalAuth, getProductBySlug);

router.post("/", protect, upload.array("images", 8), productValidation, validate, createProduct);
router.put("/:id", protect, upload.array("images", 8), productValidation, validate, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
