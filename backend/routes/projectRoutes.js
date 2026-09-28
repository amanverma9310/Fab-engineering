const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const { createUploader } = require("../utils/upload");

const router = express.Router();
const upload = createUploader("projects", "images");

const projectValidation = [
  body("title").trim().notEmpty().withMessage("Project title is required").isLength({ max: 150 }).withMessage("Title must be at most 150 characters"),
  body("description").optional().trim().isLength({ max: 5000 }).withMessage("Description must be at most 5000 characters"),
  body("category").optional().trim().isLength({ max: 100 }).withMessage("Category must be at most 100 characters"),
  body("client").optional().trim().isLength({ max: 150 }).withMessage("Client name must be at most 150 characters"),
  body("location").optional().trim().isLength({ max: 200 }).withMessage("Location must be at most 200 characters"),
  body("year").optional().isInt({ min: 1900, max: 2100 }).withMessage("Year must be a valid year"),
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

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

router.post("/", protect, upload.array("images", 8), projectValidation, validate, createProject);
router.put("/:id", protect, upload.array("images", 8), projectValidation, validate, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
