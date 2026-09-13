# FAB Engineering — MERN Stack Business Website

A full-stack website for an engineering/fabrication business: a public marketing site (services, capabilities,
projects, gallery, contact, quote requests) backed by a real MongoDB database, plus a private admin panel to
manage everything.

Design closely follows the provided reference video/screenshots (dark theme, red/green accents, bold condensed
headline type, carousel hero, numbered service cards). Two pages beyond the reference's coverage — the product
detail page and the admin panel — extend that same visual language rather than introducing a new style.

## Tech stack

**Frontend:** React 18 + Vite + JSX (no TypeScript), React Router DOM, Axios, Framer Motion (subtle transitions
only — no continuous/particle animation), React Icons, React Hot Toast, Tailwind CSS.

**Backend:** Node.js + Express, MongoDB + Mongoose, JWT auth (httpOnly cookie) + bcryptjs, Multer (local disk in
dev, auto-switches to Cloudinary in production), Helmet, express-rate-limit, express-validator,
express-mongo-sanitize, Nodemailer, Morgan.

## Folder structure

```
fab-engineering/
├── frontend/
│   ├── public/images/       — hero & workshop placeholder photography (see note below)
│   ├── src/
│   │   ├── components/      — Navbar, Hero, Footer, ServiceCard, admin/ProtectedRoute, etc.
│   │   ├── layouts/         — MainLayout (public site), AdminLayout (dashboard sidebar)
│   │   ├── pages/           — Home, About, Services, ServiceDetail, Capabilities, Projects,
│   │   │                      Gallery, Contact, Quote, admin/*
│   │   ├── context/         — AuthContext (admin session), SettingsContext (company info)
│   │   ├── services/api.js  — single Axios instance, reads VITE_API_URL
│   │   ├── utils/           — resolveImage, whatsapp link builder
│   │   └── styles/index.css
│   └── .env.example
│
├── backend/
│   ├── config/               — db.js, cloudinary.js
│   ├── models/                — Admin, Product, Inquiry, Contact, Project, Gallery, Settings
│   ├── controllers/, routes/, middleware/
│   ├── utils/                — upload.js (Multer/Cloudinary), sendEmail.js, generateToken.js
│   ├── scripts/createAdmin.js — safe first-admin creation (no hardcoded password)
│   ├── seed.js                — demo Products/Projects/Gallery content
│   └── .env.example
│
└── README.md
```

## A note on images

The reference recording only showed real photography for the hero and a couple of interior sections. I don't
have rights to the original photos, so the project ships with generated placeholder textures
(`frontend/public/images/*.jpg` and `backend/uploads/{products,projects,gallery}/*.jpg`) that match the color
palette and mood. Swap these for real workshop/product photography — via the admin panel for products/projects/
gallery, or by replacing the files directly for the hero — before going live.

## Local setup

### 1. MongoDB
Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) (or run MongoDB locally) and grab the
connection string.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env — at minimum set MONGODB_URI and JWT_SECRET
npm run seed           # demo products/projects/gallery content
npm run create-admin   # creates your admin login (reads ADMIN_EMAIL/ADMIN_PASSWORD from .env)
npm run dev            # http://localhost:5000
```

Generate a strong `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev             # http://localhost:5173
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the dashboard.

## Environment variables

**backend/.env** — see `backend/.env.example` for the full list (`MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`,
optional `EMAIL_*` for notifications, optional `CLOUDINARY_*` for production file storage, `ADMIN_*` used only by
`npm run create-admin`).

**frontend/.env** — just `VITE_API_URL`.

No secrets are committed; both `.env` files are gitignored, and only `.env.example` files (with blank/placeholder
values) are tracked.

## File uploads: local vs Cloudinary

`backend/utils/upload.js` checks whether `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
are set. If they are, all product/project/gallery images and inquiry attachments upload straight to Cloudinary.
If not, files are written to `backend/uploads/` and served statically at `/uploads/...` — convenient for local
development, but **not suitable for most production hosts** (Render/Railway don't persist local disk between
deploys), so set the Cloudinary variables before deploying.

## Creating the first admin

Never hardcode an admin password in the codebase. Instead:
```bash
cd backend
# set ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env first
npm run create-admin
```
Re-running this script is safe — if an admin with that email already exists, it does nothing.

## Deployment

- **Frontend** → Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's URL (with `/api`).
- **Backend** → Render or Railway. Set every variable from `backend/.env.example`. Set `CORS_ORIGIN` to your
  exact deployed frontend origin (this also governs the auth cookie's cross-site behavior).
- **Database** → MongoDB Atlas, with your host's IPs (or `0.0.0.0/0`) allow-listed under Network Access.
- **File storage** → Cloudinary (see above) — required in production.
- After deploying, run `npm run seed` and `npm run create-admin` once against the production `MONGODB_URI`
  (e.g. from your local machine with the production `.env` values loaded).

## Security notes

- Admin auth uses an httpOnly JWT cookie — never exposed to frontend JS.
- There is no public registration route; the only admin accounts are created via `create-admin`.
- All admin-only routes (`GET/PUT/DELETE /api/contact`, `GET/PUT/DELETE/PUT :id/status /api/inquiries`, product/
  project/gallery `POST/PUT/DELETE`, `/api/dashboard/overview`, `/api/settings` `PUT`) require a valid session.
- Contact and inquiry submission, and admin login, are all rate-limited.
- All form input is validated server-side (never trust frontend-only validation) and sanitized against NoSQL
  injection.
- Uploaded file type and size are validated by Multer before anything touches disk/Cloudinary.

## Key user flows implemented

- **General contact:** Navbar → `/contact` → `POST /api/contact` → MongoDB → Admin → Messages.
- **Service inquiry:** `/services` → service detail page → "Request quote for this service" → `/quote?product=slug`
  (service pre-selected, shown as "Selected service: …") → `POST /api/inquiries` → MongoDB → Admin → Inquiries.
- **Admin content management:** `/admin/login` → Dashboard → add/edit/delete Products/Projects/Gallery images →
  changes are immediately live on the public site via the same API the public pages read from.
