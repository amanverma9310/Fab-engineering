const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

const allowedOrigins = [
  corsOrigin,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return false;
  return allowedOrigins.some((allowed) => {
    if (allowed === "*") return false;
    try {
      const allowedUrl = new URL(allowed);
      const originUrl = new URL(origin);
      return allowedUrl.origin === originUrl.origin;
    } catch {
      return allowed === origin;
    }
  });
}

function validateOrigin(req, res, next) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  const isAllowed = isOriginAllowed(origin);

  if (!isAllowed) {
    console.warn(`[Origin Validation] Blocked ${req.method} ${req.originalUrl} from origin: ${origin}`);
    return res.status(403).json({
      success: false,
      message: "Request origin not allowed",
    });
  }

  next();
}

module.exports = { validateOrigin, isOriginAllowed };