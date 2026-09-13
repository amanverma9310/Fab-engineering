const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Inquiry = require("../models/Inquiry");
const Product = require("../models/Product");
const { normalizeUploadedFile } = require("../utils/upload");
const { generateInquiryId } = require("../utils/generateInquiryId");
const { sendOwnerNotification, sendCustomerConfirmation } = require("../utils/sendEmail");

// @route  POST /api/inquiries (multipart/form-data, field name "attachments")
// @access Public
const createInquiry = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const {
    customerName,
    companyName,
    email,
    phone,
    whatsapp,
    product, // Product _id, optional
    service, // free-text service name (e.g. from the quote dropdown)
    quantity,
    material,
    description,
    projectDetails,
    expectedDate,
    address,
    source,
  } = req.body;

  let productDoc = null;
  let serviceName = service;
  if (product) {
    productDoc = await Product.findById(product);
    if (productDoc) serviceName = serviceName || productDoc.name;
  }

  const inquiry = await Inquiry.create({
    inquiryId: generateInquiryId(),
    customerName,
    companyName,
    email,
    phone,
    whatsapp,
    product: productDoc?._id,
    service: serviceName,
    quantity: quantity || undefined,
    material,
    description,
    projectDetails,
    expectedDate: expectedDate || undefined,
    address,
    attachments: (req.files || []).map(normalizeUploadedFile),
    source: source || (productDoc ? "product_page" : "general"),
  });

  sendOwnerNotification({
    subject: `New inquiry received: ${inquiry.inquiryId}`,
    fields: [
      ["Inquiry ID", inquiry.inquiryId],
      ["Name", inquiry.customerName],
      ["Company", inquiry.companyName],
      ["Email", inquiry.email],
      ["Phone", inquiry.phone],
      ["WhatsApp", inquiry.whatsapp],
      ["Service", inquiry.service],
      ["Quantity", inquiry.quantity],
      ["Material", inquiry.material],
      ["Description", inquiry.description],
      ["Project details", inquiry.projectDetails],
      ["Expected date", inquiry.expectedDate],
      ["Attachments", inquiry.attachments.length],
    ],
  }).catch(() => {});
  sendCustomerConfirmation({
    to: inquiry.email,
    name: inquiry.customerName,
    referenceId: inquiry.inquiryId,
  }).catch(() => {});

  res.status(201).json({
    success: true,
    message: "Inquiry sent successfully.",
    data: { id: inquiry._id, inquiryId: inquiry.inquiryId },
  });
});

// @route  GET /api/inquiries
// @access Private
const getInquiries = asyncHandler(async (req, res) => {
  const { status, search, source, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status && status !== "All") query.status = status;
  if (source && source !== "All") query.source = source;
  if (search) query.$text = { $search: search };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const [inquiries, total] = await Promise.all([
    Inquiry.find(query)
      .populate("product", "name slug")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Inquiry.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: inquiries,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
  });
});

// @route  GET /api/inquiries/:id
// @access Private
const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id).populate("product", "name slug images");
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }
  res.json({ success: true, data: inquiry });
});

// @route  PUT /api/inquiries/:id
// @access Private (admin notes etc.)
const updateInquiry = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { ...(adminNotes !== undefined && { adminNotes }) },
    { new: true, runValidators: true }
  );
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }
  res.json({ success: true, data: inquiry });
});

// @route  PUT /api/inquiries/:id/status
// @access Private
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const allowed = [
    "New",
    "Reviewing",
    "Contacted",
    "Quoted",
    "Approved",
    "In Progress",
    "Completed",
    "Rejected",
  ];
  const { status } = req.body;
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${allowed.join(", ")}`);
  }

  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }
  res.json({ success: true, data: inquiry });
});

// @route  DELETE /api/inquiries/:id
// @access Private
const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }
  res.json({ success: true, message: "Inquiry deleted" });
});

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  updateInquiryStatus,
  deleteInquiry,
};
