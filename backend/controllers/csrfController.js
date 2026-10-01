const { getCsrfToken } = require("../middleware/csrf");

const getCsrfTokenHandler = (req, res) => {
  let token = getCsrfToken(req);
  if (!token) {
    const crypto = require("crypto");
    token = crypto.randomBytes(32).toString("hex");
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("csrf_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }
  res.json({ success: true, csrfToken: token });
};

module.exports = { getCsrfTokenHandler };