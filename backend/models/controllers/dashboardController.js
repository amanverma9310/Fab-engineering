const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Inquiry = require("../models/Inquiry");
const Contact = require("../models/Contact");

// @route  GET /api/dashboard/overview
// @access Private
const getOverview = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    activeProducts,
    totalInquiries,
    newInquiries,
    completedInquiries,
    totalMessages,
    unreadMessages,
    latestInquiries,
    latestMessages,
    recentProducts,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "New" }),
    Inquiry.countDocuments({ status: "Completed" }),
    Contact.countDocuments(),
    Contact.countDocuments({ status: "New" }),
    Inquiry.find().sort({ createdAt: -1 }).limit(5).populate("product", "name"),
    Contact.find().sort({ createdAt: -1 }).limit(5),
    Product.find().sort({ createdAt: -1 }).limit(5).select("name category createdAt isActive"),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts,
      activeProducts,
      totalInquiries,
      newInquiries,
      completedInquiries,
      totalMessages,
      unreadMessages,
      latestInquiries,
      latestMessages,
      recentProducts,
    },
  });
});

module.exports = { getOverview };
