// Run with: npm run reset-admin-password
// Reads RESET_ADMIN_EMAIL and RESET_ADMIN_NEW_PASSWORD from backend/.env.
// Use this only if you're locked out of the dashboard — otherwise, changing
// your password from Admin → Account in the UI is the normal path (it
// requires your current password, which this script does not).
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

async function run() {
  await connectDB();

  const { RESET_ADMIN_EMAIL, RESET_ADMIN_NEW_PASSWORD } = process.env;

  if (!RESET_ADMIN_EMAIL || !RESET_ADMIN_NEW_PASSWORD) {
    console.error(
      "Set RESET_ADMIN_EMAIL and RESET_ADMIN_NEW_PASSWORD in backend/.env before running this script."
    );
    process.exit(1);
  }
  if (RESET_ADMIN_NEW_PASSWORD.length < 8) {
    console.error("RESET_ADMIN_NEW_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const email = RESET_ADMIN_EMAIL.toLowerCase().trim();
  const admin = await Admin.findOne({ email });

  if (!admin) {
    console.error(`No admin found with email "${email}".`);
    process.exit(1);
  }

  admin.password = RESET_ADMIN_NEW_PASSWORD; // re-hashed by the pre-save hook
  await admin.save();

  console.log(`Password reset for ${email}. Remove RESET_ADMIN_* from .env now that you're done.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to reset password:", err);
  process.exit(1);
});
