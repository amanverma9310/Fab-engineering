const asyncHandler = require("express-async-handler");

// Common disposable/temporary email domains (subset - extend as needed)
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "dispostable.com",
  "getnada.com",
  "maildrop.cc",
  "sharklasers.com",
  "grr.la",
  "spamgourmet.com",
  "mintemail.com",
  "emailondeck.com",
  "mailnesia.com",
  "moakt.com",
  "dodgit.com",
  "spam4.me",
  "bccto.me",
  "chacuo.net",
  "emailfake.com",
  "emailgenerator.org",
  "fakemailgenerator.com",
  "tempail.com",
  "tempemail.co",
  "temporaryemail.net",
]);

// Spam keywords that commonly appear in bot submissions
const SPAM_KEYWORDS = [
  "viagra",
  "cialis",
  "casino",
  "lottery",
  "winner",
  "congratulations",
  "click here",
  "act now",
  "limited time",
  "free money",
  "make money",
  "work from home",
  "bitcoin",
  "crypto",
  "investment opportunity",
  "seo services",
  "link building",
  "guest post",
  "backlink",
];

function isDisposableEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain && DISPOSABLE_DOMAINS.has(domain);
}

function containsSpamContent(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some((kw) => lower.includes(kw));
}

function containsExcessiveLinks(text) {
  if (!text) return false;
  // Count http/https links
  const urlMatches = text.match(/https?:\/\/\S+/gi);
  return urlMatches && urlMatches.length > 2;
}

function honeypotCheck(req, res, next) {
  // Check hidden honeypot field (name="website" or "url" - bots often fill these)
  const honeypot = req.body.website || req.body.url || req.body.hp_field || "";
  if (honeypot && honeypot.trim() !== "") {
    return res.status(400).json({
      success: false,
      message: "Spam detected",
    });
  }
  next();
}

function disposableEmailCheck(req, res, next) {
  const email = req.body.email || req.body.customerEmail || "";
  if (isDisposableEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Temporary/disposable email addresses are not allowed",
    });
  }
  next();
}

function contentSpamCheck(req, res, next) {
  const textFields = [
    req.body.message,
    req.body.description,
    req.body.projectDetails,
    req.body.subject,
    req.body.companyName,
  ].filter(Boolean);

  for (const text of textFields) {
    if (containsSpamContent(text)) {
      return res.status(400).json({
        success: false,
        message: "Message appears to be spam",
      });
    }
    if (containsExcessiveLinks(text)) {
      return res.status(400).json({
        success: false,
        message: "Too many links in message",
      });
    }
  }
  next();
}

// Per-email rate limiting (in-memory, resets on restart - use Redis in production)
const emailAttempts = new Map();
const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const EMAIL_MAX_ATTEMPTS = 3; // Max 3 submissions per email per hour

function emailRateLimit(req, res, next) {
  const email = (req.body.email || req.body.customerEmail || "").toLowerCase().trim();
  if (!email) return next();

  const now = Date.now();
  const attempts = emailAttempts.get(email) || [];
  const recent = attempts.filter((t) => now - t < EMAIL_WINDOW_MS);

  if (recent.length >= EMAIL_MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Too many submissions from this email. Please try again later.",
    });
  }

  recent.push(now);
  emailAttempts.set(email, recent);
  next();
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, attempts] of emailAttempts.entries()) {
    const recent = attempts.filter((t) => now - t < EMAIL_WINDOW_MS);
    if (recent.length === 0) emailAttempts.delete(email);
    else emailAttempts.set(email, recent);
  }
}, 15 * 60 * 1000); // Every 15 min

module.exports = {
  honeypotCheck,
  disposableEmailCheck,
  contentSpamCheck,
  emailRateLimit,
  isDisposableEmail,
  containsSpamContent,
};