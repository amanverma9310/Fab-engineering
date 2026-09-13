const express = require("express");
const { body } = require("express-validator");
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
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("shortDescription").trim().notEmpty().withMessage("Short description is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

router.get("/", optionalAuth, getProducts);
router.get("/:slug", optionalAuth, getProductBySlug);

router.post("/", protect, upload.array("images", 8), productValidation, createProduct);
router.put("/:id", protect, upload.array("images", 8), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
