const nodemailer = require("nodemailer");

function isEmailConfigured() {
  return Boolean(
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_SERVICE
  );
}

function buildTransporter() {
  const service = (process.env.EMAIL_SERVICE || "").toLowerCase();

  // Resend API
  if (service === "resend") {
    const apiKey = process.env.EMAIL_PASS;

    return {
      sendMail: async ({ from, to, subject, html }) => {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [to],
            subject,
            html,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();

          throw new Error(
            `Resend API error: ${res.status} ${errText}`
          );
        }

        return res.json();
      },
    };
  }

  // Gmail / other SMTP service
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function rows(fields) {
  return fields
    .filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    })
    .map(
      ([key, value]) =>
        `<p style="margin:4px 0">
          <strong>${escapeHtml(key)}:</strong>
          ${escapeHtml(String(value))}
        </p>`
    )
    .join("");
}

/**
 * Sends notification email to the website owner.
 * Email failure does not affect the main API request.
 */
async function sendOwnerNotification({ subject, fields }) {
  if (!isEmailConfigured()) {
    console.warn(
      "[email] Skipping notification — EMAIL_SERVICE/EMAIL_USER/EMAIL_PASS not set."
    );

    return {
      sent: false,
      reason: "not_configured",
    };
  }

  try {
    const transporter = buildTransporter();

    const to =
      process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;

    await transporter.sendMail({
      from: `"FAB Engineering Website" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          ${rows(fields)}
        </div>
      `,
    });

    return {
      sent: true,
    };
  } catch (err) {
    console.error(
      "[email] Failed to send owner notification:",
      err.message
    );

    return {
      sent: false,
      reason: "send_failed",
    };
  }
}

/**
 * Sends confirmation email to customer.
 */
async function sendCustomerConfirmation({
  to,
  name,
  referenceId,
}) {
  if (!isEmailConfigured() || !to) {
    return {
      sent: false,
    };
  }

  try {
    const transporter = buildTransporter();

    await transporter.sendMail({
      from: `"FAB Engineering" <${process.env.EMAIL_USER}>`,

      to,

      subject: `We've received your request${
        referenceId ? ` (${referenceId})` : ""
      }`,

      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <p>Hi ${escapeHtml(name || "there")},</p>

          <p>
            Thanks for reaching out to FAB Engineering.
            We've received your request
            ${
              referenceId
                ? ` (reference <strong>${escapeHtml(
                    referenceId
                  )}</strong>)`
                : ""
            }
            and our team will get back to you shortly.
          </p>

          <p>— FAB Engineering</p>
        </div>
      `,
    });

    return {
      sent: true,
    };
  } catch (err) {
    console.error(
      "[email] Failed to send customer confirmation:",
      err.message
    );

    return {
      sent: false,
    };
  }
}

module.exports = {
  sendOwnerNotification,
  sendCustomerConfirmation,
  isEmailConfigured,
};