const express = require("express");
const {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");
const { protect } = require("../middleware/auth");
const { createUploader } = require("../utils/upload");

const router = express.Router();
const upload = createUploader("team", "images");

router.get("/", getTeamMembers);

router.post("/", protect, upload.single("photo"), createTeamMember);
router.put("/:id", protect, upload.single("photo"), updateTeamMember);
router.delete("/:id", protect, deleteTeamMember);

module.exports = router;
