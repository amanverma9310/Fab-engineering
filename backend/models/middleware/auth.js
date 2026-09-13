const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      res.status(401);
      throw new Error("Not authorized. Admin account no longer exists.");
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized. Invalid or expired session.");
  }
});

const requireSuperadmin = (req, res, next) => {
  if (req.admin?.role !== "superadmin") {
    res.status(403);
    throw new Error("Superadmin access required.");
  }
  next();
};

// Attaches req.admin if a valid session exists, but never blocks the
// request — used on public GET routes that behave slightly differently for
// logged-in admins (e.g. showing inactive products).
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
  } catch {
    // ignore invalid/expired token — just proceed unauthenticated
  }
  next();
};

module.exports = { protect, requireSuperadmin, optionalAuth };
