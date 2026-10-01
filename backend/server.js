require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { csrfProtection } = require("./middleware/csrf");
const { validateOrigin } = require("./middleware/originValidation");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const projectRoutes = require("./routes/projectRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const teamRoutes = require("./routes/teamRoutes");
const csrfRoutes = require("./routes/csrfRoutes");

connectDB();

const app = express();
app.set("trust proxy", 1);

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
// Allow multiple origins for local development (Vite may use different ports)
const allowedOrigins = [
  corsOrigin,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:", "blob:"],
        "font-src": ["'self'", "data:"],
        "connect-src": ["'self'", corsOrigin, "http://localhost:5174", "http://127.0.0.1:5174", "https://res.cloudinary.com"],
        "frame-ancestors": ["'none'"],
        "form-action": ["'self'"],
        "base-uri": ["'self'"],
        "object-src": ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    noSniff: true,
    xssFilter: true,
    frameguard: { action: "deny" },
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
      usb: [],
    },
  })
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Apply Origin/Referer validation to public mutation endpoints
app.use("/api/contact", validateOrigin);
app.use("/api/inquiries", validateOrigin);

// Apply CSRF protection only to admin/auth routes (cookie-based sessions)
app.use("/api/auth", csrfProtection);
app.use("/api/dashboard", csrfProtection);
app.use("/api/settings", csrfProtection);
app.use("/api/products", csrfProtection);
app.use("/api/projects", csrfProtection);
app.use("/api/gallery", csrfProtection);
app.use("/api/team", csrfProtection);

// Serves locally-uploaded files (dev / no Cloudinary configured).
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/team", teamRoutes);
app.use("/api", csrfRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
