const express = require("express");
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

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

router.post("/", protect, upload.array("images", 8), createProject);
router.put("/:id", protect, upload.array("images", 8), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
