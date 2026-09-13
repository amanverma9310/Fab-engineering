const asyncHandler = require("express-async-handler");
const TeamMember = require("../models/TeamMember");
const { normalizeUploadedFile } = require("../utils/upload");

// @route  GET /api/team
// @access Public
const getTeamMembers = asyncHandler(async (req, res) => {
  const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: members });
});

// @route  POST /api/team (multipart/form-data, field name "photo")
// @access Private
const createTeamMember = asyncHandler(async (req, res) => {
  const { name, role, bio, linkedin, order } = req.body;

  if (!name || !role) {
    res.status(400);
    throw new Error("Name and role are required");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("A photo is required");
  }

  const member = await TeamMember.create({
    name,
    role,
    bio,
    linkedin,
    order: order || 0,
    photo: normalizeUploadedFile(req.file).url,
  });

  res.status(201).json({ success: true, data: member });
});

// @route  PUT /api/team/:id (multipart/form-data if a new photo is attached)
// @access Private
const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }

  const { name, role, bio, linkedin, order } = req.body;
  if (name !== undefined) member.name = name;
  if (role !== undefined) member.role = role;
  if (bio !== undefined) member.bio = bio;
  if (linkedin !== undefined) member.linkedin = linkedin;
  if (order !== undefined) member.order = order;
  if (req.file) member.photo = normalizeUploadedFile(req.file).url;

  await member.save();
  res.json({ success: true, data: member });
});

// @route  DELETE /api/team/:id
// @access Private
const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }
  res.json({ success: true, message: "Team member deleted" });
});

module.exports = { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember };
