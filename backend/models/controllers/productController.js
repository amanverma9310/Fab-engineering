const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Product = require("../models/Product");
const { normalizeUploadedFile } = require("../utils/upload");

async function uniqueSlug(name, excludeId) {
  const base = slugify(name, { lower: true, strict: true });
  let slug = base;
  let i = 1;
  while (await Product.findOne({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}

// @route  GET /api/products
// @access Public — only active products, unless an admin session requests all
const getProducts = asyncHandler(async (req, res) => {
  const { category, featured, all } = req.query;
  const query = {};

  if (!(all === "true" && req.admin)) query.isActive = true;
  if (category) query.category = category;
  if (featured === "true") query.featured = true;

  const products = await Product.find(query).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: products });
});

// @route  GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product || (!product.isActive && !req.admin)) {
    res.status(404);
    throw new Error("Product not found");
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
  }).limit(3);

  res.json({ success: true, data: product, related });
});

// @route  POST /api/products (multipart/form-data, field name "images")
const createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  ["features", "specifications"].forEach((f) => {
    if (typeof body[f] === "string") {
      try {
        body[f] = JSON.parse(body[f]);
      } catch {
        /* leave as-is; validated below */
      }
    }
  });

  if (!body.name) {
    res.status(400);
    throw new Error("Product name is required");
  }

  body.slug = await uniqueSlug(body.name);
  body.images = (req.files || []).map((f) => normalizeUploadedFile(f).url);

  const product = await Product.create(body);
  res.status(201).json({ success: true, data: product });
});

// @route  PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const body = { ...req.body };
  ["features", "specifications"].forEach((f) => {
    if (typeof body[f] === "string") {
      try {
        body[f] = JSON.parse(body[f]);
      } catch {
        /* leave as-is */
      }
    }
  });

  if (body.name && body.name !== product.name) {
    body.slug = await uniqueSlug(body.name, product._id);
  }

  const newImages = (req.files || []).map((f) => normalizeUploadedFile(f).url);
  if (newImages.length) {
    // Append new uploads; the admin UI sends the surviving existing URLs
    // back in body.existingImages so removed ones don't reappear.
    const existing = Array.isArray(body.existingImages)
      ? body.existingImages
      : body.existingImages
      ? [body.existingImages]
      : product.images;
    body.images = [...existing, ...newImages];
  } else if (body.existingImages !== undefined) {
    body.images = Array.isArray(body.existingImages) ? body.existingImages : [body.existingImages];
  }
  delete body.existingImages;

  Object.assign(product, body);
  await product.save();

  res.json({ success: true, data: product });
});

// @route  DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, message: "Product deleted" });
});

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };
