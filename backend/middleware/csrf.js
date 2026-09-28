const crypto = require("crypto");

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

function csrfProtection(req, res, next) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  const isSafeMethod = safeMethods.includes(req.method);

  if (isSafeMethod) {
    if (!req.cookies[CSRF_COOKIE_NAME]) {
      const token = generateCsrfToken();
      const isProd = process.env.NODE_ENV === "production";
      res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
    }
    return next();
  }

  const cookieToken = req.cookies[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
  }

  next();
}

function getCsrfToken(req) {
  return req.cookies[CSRF_COOKIE_NAME];
}

module.exports = { csrfProtection, getCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME };