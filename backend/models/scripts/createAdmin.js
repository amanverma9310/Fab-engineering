// Run with: npm run create-admin
// Reads credentials from backend/.env (ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD)
// instead of hardcoding a password anywhere in the codebase. Safe to re-run —
// if an admin with that email already exists, it leaves it untouched.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

async function run() {
  await connectDB();

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running `npm run create-admin`."
    );
    process.exit(1);
  }
  if (ADMIN_PASSWORD.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`An admin with email "${email}" already exists — nothing to do.`);
  } else {
    await Admin.create({
      name: ADMIN_NAME || "Admin",
      email,
      password: ADMIN_PASSWORD, // hashed automatically by the pre-save hook
      role: "superadmin",
    });
    console.log(`Admin account created: ${email}`);
    console.log("You can now log in at /admin/login with this email and the password from .env.");
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});
