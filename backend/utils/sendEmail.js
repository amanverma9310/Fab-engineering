const nodemailer = require("nodemailer");

function isEmailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_SERVICE);
}

function buildTransporter() {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(fields) {
  return fields
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `<p style="margin:4px 0"><strong>${k}:</strong> ${escapeHtml(String(v))}</p>`)
    .join("");
}

/**
 * Sends the business-owner notification email. Never throws — email is a
 * nice-to-have; the underlying record must already be saved to MongoDB
 * before this is called, and its success/failure never affects the
 * customer-facing response.
 */
async function sendOwnerNotification({ subject, fields }) {
  if (!isEmailConfigured()) {
    console.warn("[email] Skipping notification — EMAIL_SERVICE/EMAIL_USER/EMAIL_PASS not set.");
    return { sent: false, reason: "not_configured" };
  }

  try {
    const transporter = buildTransporter();
    const to = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;
    await transporter.sendMail({
      from: `"FAB Engineering Website" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<div style="font-family:sans-serif;line-height:1.6">${rows(fields)}</div>`,
    });
    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send owner notification:", err.message);
    return { sent: false, reason: "send_failed" };
  }
}

/** Optional confirmation email to the customer — also never throws. */
async function sendCustomerConfirmation({ to, name, referenceId }) {
  if (!isEmailConfigured() || !to) return { sent: false };

  try {
    const transporter = buildTransporter();
    await transporter.sendMail({
      from: `"FAB Engineering" <${process.env.EMAIL_USER}>`,
      to,
      subject: `We've received your request${referenceId ? ` (${referenceId})` : ""}`,
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <p>Hi ${escapeHtml(name || "there")},</p>
          <p>Thanks for reaching out to FAB Engineering. We've received your request${
            referenceId ? ` (reference <strong>${escapeHtml(referenceId)}</strong>)` : ""
          } and our team will get back to you shortly.</p>
          <p>— FAB Engineering</p>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send customer confirmation:", err.message);
    return { sent: false };
  }
}

module.exports = { sendOwnerNotification, sendCustomerConfirmation, isEmailConfigured };
