const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Project = require("../models/Project");
const { normalizeUploadedFile } = require("../utils/upload");

async function uniqueSlug(title, excludeId) {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let i = 1;
  while (await Project.findOne({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: projects });
});

const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, data: project });
});

const createProject = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (!body.title) {
    res.status(400);
    throw new Error("Project title is required");
  }
  body.slug = await uniqueSlug(body.title);
  body.images = (req.files || []).map((f) => normalizeUploadedFile(f).url);

  const project = await Project.create(body);
  res.status(201).json({ success: true, data: project });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const body = { ...req.body };
  if (body.title && body.title !== project.title) {
    body.slug = await uniqueSlug(body.title, project._id);
  }

  const newImages = (req.files || []).map((f) => normalizeUploadedFile(f).url);
  if (newImages.length) {
    const existing = Array.isArray(body.existingImages)
      ? body.existingImages
      : body.existingImages
      ? [body.existingImages]
      : project.images;
    body.images = [...existing, ...newImages];
  } else if (body.existingImages !== undefined) {
    body.images = Array.isArray(body.existingImages) ? body.existingImages : [body.existingImages];
  }
  delete body.existingImages;

  Object.assign(project, body);
  await project.save();
  res.json({ success: true, data: project });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, message: "Project deleted" });
});

module.exports = { getProjects, getProjectBySlug, createProject, updateProject, deleteProject };
