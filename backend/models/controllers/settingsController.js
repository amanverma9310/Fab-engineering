const asyncHandler = require("express-async-handler");
const Settings = require("../models/Settings");
const { normalizeUploadedFile } = require("../utils/upload");

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
}

// @route  GET /api/settings — public, used to hydrate the whole public site
const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: settings });
});

// @route  PUT /api/settings — protected; accepts multipart if a new logo is attached
const updateSettings = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  if (typeof body.socialLinks === "string") {
    try {
      body.socialLinks = JSON.parse(body.socialLinks);
    } catch {
      delete body.socialLinks;
    }
  }

  if (req.file) {
    body.logo = normalizeUploadedFile(req.file).url;
  }

  const settings = await Settings.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json({ success: true, data: settings });
});

module.exports = { getSettings, updateSettings };
