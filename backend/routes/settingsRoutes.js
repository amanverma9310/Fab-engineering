const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect } = require("../middleware/auth");
const { createUploader } = require("../utils/upload");

const router = express.Router();
const upload = createUploader("settings", "images");

router.get("/", getSettings);
router.put("/", protect, upload.single("logo"), updateSettings);

module.exports = router;
