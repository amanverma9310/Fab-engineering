const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");
const { sendOwnerNotification } = require("../utils/sendEmail");

// @route  POST /api/contact
// @access Public
const createContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, phone, subject, message, service } = req.body;
  const contact = await Contact.create({ name, email, phone, subject, message, service });

  sendOwnerNotification({
    subject: `New contact message: ${contact.subject}`,
    fields: [
      ["Name", contact.name],
      ["Email", contact.email],
      ["Phone", contact.phone],
      ["Subject", contact.subject],
      ["Service of interest", contact.service],
      ["Message", contact.message],
    ],
  }).catch(() => {});

  res.status(201).json({ success: true, message: "Message sent successfully.", data: { id: contact._id } });
});

// @route  GET /api/contact
// @access Private
const getContacts = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status && status !== "All") query.status = status;
  if (search) query.$text = { $search: search };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const [contacts, total] = await Promise.all([
    Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Contact.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: contacts,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
  });
});

// @route  GET /api/contact/:id
// @access Private
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: contact });
});

// @route  PUT /api/contact/:id  — status updates (Mark read / replied)
const updateContact = asyncHandler(async (req, res) => {
  const allowed = ["New", "Read", "Replied"];
  const { status } = req.body;
  if (status && !allowed.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${allowed.join(", ")}`);
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }) },
    { new: true, runValidators: true }
  );
  if (!contact) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: contact });
});

// @route  DELETE /api/contact/:id
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, message: "Message deleted" });
});

module.exports = { createContact, getContacts, getContactById, updateContact, deleteContact };
