// Run with: npm run seed
// Safe to re-run — only inserts into collections that are currently empty.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const Project = require("./models/Project");
const Gallery = require("./models/Gallery");
const Settings = require("./models/Settings");

const img = (name) => `/uploads/products/${name}`;

const productsSeed = [
  {
    name: "CAD Design",
    category: "Design",
    serviceType: "CAD Design",
    shortDescription: "2D drawings and 3D CAD modelling that make production clearer.",
    description:
      "We turn rough ideas, sketches or reference parts into precise 2D manufacturing drawings and 3D CAD models, so there's no ambiguity once a job reaches the shop floor. Every drawing is checked for manufacturability before it's signed off.",
    features: ["2D manufacturing drawings", "3D CAD modelling", "Design for manufacture review", "Revision tracking"],
    specifications: [
      { key: "Software", value: "SolidWorks, AutoCAD" },
      { key: "File formats", value: "DWG, DXF, STEP, PDF" },
      { key: "Typical turnaround", value: "2–5 working days" },
    ],
    images: [img("cad-design.jpg"), img("cad-design-2.jpg")],
    featured: true,
    order: 0,
  },
  {
    name: "Custom Fabrication",
    category: "Fabrication",
    serviceType: "Custom Fabrication",
    shortDescription: "Practical custom metalwork for equipment, enclosures and components.",
    description:
      "From one-off brackets to full equipment frames, we handle custom fabrication end to end — cutting, forming, welding and finishing to the tolerances your application needs.",
    features: ["One-off and small-batch runs", "Mild steel, stainless, aluminium", "In-house welding and finishing"],
    specifications: [
      { key: "Materials", value: "MS, SS304/316, Aluminium" },
      { key: "Max sheet size", value: "2500 x 1250 mm" },
    ],
    images: [img("custom-fabrication.jpg"), img("custom-fabrication-2.jpg")],
    featured: true,
    order: 1,
  },
  {
    name: "Laser Cutting",
    category: "Cutting",
    serviceType: "Laser Cutting",
    shortDescription: "Accurate laser cutting for sheet metal components and custom fabrication.",
    description:
      "High-precision fiber laser cutting for mild steel, stainless steel and aluminium sheet, with clean edges that reduce downstream finishing work.",
    features: ["High dimensional accuracy", "Clean finished edges", "Nesting for material efficiency"],
    specifications: [
      { key: "Thickness range", value: "0.5 mm – 20 mm" },
      { key: "Bed size", value: "3000 x 1500 mm" },
      { key: "Tolerance", value: "± 0.1 mm" },
    ],
    images: [img("laser-cutting.jpg"), img("laser-cutting-2.jpg")],
    featured: true,
    order: 2,
  },
  {
    name: "Powder Coating",
    category: "Finishing",
    serviceType: "Powder Coating",
    shortDescription: "Durable professional surface finishing and protection.",
    description:
      "Electrostatic powder coating that gives fabricated parts a durable, even, corrosion-resistant finish in the colour and texture your project calls for.",
    features: ["Wide RAL colour range", "Corrosion resistant", "Pre-treatment included"],
    specifications: [{ key: "Coating types", value: "Matte, gloss, textured" }],
    images: [img("powder-coating.jpg"), img("powder-coating-2.jpg")],
    order: 3,
  },
  {
    name: "Prototype Development",
    category: "Design",
    serviceType: "Prototype Development",
    shortDescription: "Move from concept to a tested physical part with less guesswork.",
    description:
      "We help you validate a design quickly — building functional prototypes so you can test fit, form and function before committing to a production run.",
    features: ["Rapid iteration", "Design feedback included", "Small batch scaling support"],
    specifications: [{ key: "Typical lead time", value: "3–7 working days" }],
    images: [img("prototype-development.jpg"), img("prototype-development-2.jpg")],
    order: 4,
  },
  {
    name: "Sheet Bending",
    category: "Forming",
    serviceType: "Sheet Bending",
    shortDescription: "Precise press brake bending according to engineering drawings.",
    description:
      "CNC press brake bending for accurate, repeatable folds across a wide range of sheet thicknesses and part geometries.",
    features: ["CNC press brake", "Complex multi-bend parts", "Tight tolerance forming"],
    specifications: [
      { key: "Max length", value: "3000 mm" },
      { key: "Max thickness", value: "12 mm mild steel" },
    ],
    images: [img("sheet-bending.jpg"), img("sheet-bending-2.jpg")],
    order: 5,
  },
  {
    name: "Sheet Metal Fabrication",
    category: "Fabrication",
    serviceType: "Sheet Metal Fabrication",
    shortDescription: "Free from pattern to production, sheet metal components at scale.",
    description:
      "End-to-end sheet metal fabrication — cutting, forming, welding, and assembly — for enclosures, panels, brackets and structural components.",
    features: ["Enclosures & panels", "Structural brackets", "Batch production ready"],
    specifications: [{ key: "Gauge range", value: "22 ga – 3/8 in" }],
    images: [img("sheet-metal-fabrication.jpg"), img("sheet-metal-fabrication-2.jpg")],
    order: 6,
  },
  {
    name: "Welding",
    category: "Fabrication",
    serviceType: "Welding",
    shortDescription: "Structural and precision welding across common industrial metals.",
    description:
      "Certified MIG and TIG welding for structural assemblies and precision components, with finishing to match your application's requirements.",
    features: ["MIG & TIG welding", "Structural assemblies", "Weld finishing & grinding"],
    specifications: [{ key: "Processes", value: "MIG, TIG, Spot" }],
    images: [img("welding.jpg"), img("welding-2.jpg")],
    order: 7,
  },
];

const projectImg = (name) => `/uploads/projects/${name}`;
const projectsSeed = [
  {
    title: "Warehouse Mezzanine Frame",
    category: "Structural",
    client: "Logistics client, Delhi NCR",
    description: "Structural steel mezzanine framing fabricated and installed for additional warehouse storage capacity.",
    images: [projectImg("warehouse-mezzanine-frame.jpg")],
    featured: true,
    order: 0,
  },
  {
    title: "Custom Control Panel Enclosures",
    category: "Sheet Metal",
    client: "Industrial automation OEM",
    description: "A production run of powder-coated control panel enclosures, laser cut and formed to IP-rated tolerances.",
    images: [projectImg("custom-control-panel-enclosures.jpg")],
    featured: true,
    order: 1,
  },
  {
    title: "Conveyor Guarding System",
    category: "Fabrication",
    client: "Manufacturing plant",
    description: "Laser-cut and welded safety guarding for a conveyor line, designed to relevant machine safety standards.",
    images: [projectImg("conveyor-guarding-system.jpg")],
    order: 2,
  },
  {
    title: "Retail Display Fixtures",
    category: "Custom Fabrication",
    client: "Retail chain",
    description: "Prototype-to-production run of branded metal retail display fixtures.",
    images: [projectImg("retail-display-fixtures.jpg")],
    order: 3,
  },
];

const galleryImg = (name) => `/uploads/gallery/${name}`;
const gallerySeed = [
  { image: galleryImg("gallery-1.jpg"), caption: "Laser cutting bay", category: "Shop Floor", order: 0 },
  { image: galleryImg("gallery-2.jpg"), caption: "Precision folded sheet metal", category: "Product", order: 1 },
  { image: galleryImg("gallery-3.jpg"), caption: "Welding station", category: "Shop Floor", order: 2 },
  { image: galleryImg("gallery-4.jpg"), caption: "Finished enclosure batch", category: "Product", order: 3 },
  { image: galleryImg("gallery-5.jpg"), caption: "Powder coating line", category: "Shop Floor", order: 4 },
  { image: galleryImg("gallery-6.jpg"), caption: "CAD design review", category: "Office", order: 5 },
];

async function seed() {
  await connectDB();

  if ((await Product.countDocuments()) === 0) {
    // insertMany doesn't run schema-level slug generation, so set it here.
    const slugify = require("slugify");
    const withSlugs = productsSeed.map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true }),
    }));
    await Product.insertMany(withSlugs);
    console.log(`Seeded ${withSlugs.length} products/services.`);
  } else {
    console.log("Products already has data — skipping.");
  }

  if ((await Project.countDocuments()) === 0) {
    const slugify = require("slugify");
    const withSlugs = projectsSeed.map((p) => ({
      ...p,
      slug: slugify(p.title, { lower: true, strict: true }),
    }));
    await Project.insertMany(withSlugs);
    console.log(`Seeded ${withSlugs.length} projects.`);
  } else {
    console.log("Projects already has data — skipping.");
  }

  if ((await Gallery.countDocuments()) === 0) {
    await Gallery.insertMany(gallerySeed);
    console.log(`Seeded ${gallerySeed.length} gallery images.`);
  } else {
    console.log("Gallery already has data — skipping.");
  }

  if ((await Settings.countDocuments()) === 0) {
    await Settings.create({});
    console.log("Created default settings document.");
  }

  console.log("Seeding complete. Remember to also run `npm run create-admin`.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
