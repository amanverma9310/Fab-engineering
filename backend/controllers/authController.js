const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const { generateToken, setTokenCookie, clearTokenCookie } = require("../utils/generateToken");

// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;
  const genericError = () => {
    res.status(401);
    throw new Error("Invalid email or password");
  };

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!admin) return genericError();

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return genericError();

  const token = generateToken(admin._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// @route  POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: "Logged out" });
});

// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @route  PUT /api/auth/profile
// @access Private — lets the logged-in admin change their own name, email,
// and/or password. Changing the password always requires the current
// password, so a stolen session cookie alone can't lock the real owner out.
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select("+password");

  if (name) admin.name = name;
  if (email) admin.email = email.toLowerCase().trim();

  if (newPassword) {
    if (!currentPassword) {
      res.status(400);
      throw new Error("Enter your current password to set a new one.");
    }
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect.");
    }
    if (newPassword.length < 8) {
      res.status(400);
      throw new Error("New password must be at least 8 characters.");
    }
    admin.password = newPassword; // re-hashed automatically by the pre-save hook
  }

  await admin.save();

  res.json({
    success: true,
    message: "Profile updated successfully.",
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

module.exports = { login, logout, getMe, updateProfile };
