import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiShield, FiTarget, FiUsers } from "react-icons/fi";
import Hero from "../components/Hero";
import ServiceCard from "../components/ServiceCard";
import FeatureListSection from "../components/FeatureListSection";
import CTABanner from "../components/CTABanner";
import { GridSkeleton } from "../components/Skeletons";
import api from "../services/api";
import Seo, { SITE_URL } from "../components/Seo";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "FAB Engineering",
  description:
    "FAB Engineering provides laser cutting, sheet metal fabrication, bending, powder coating and custom engineering solutions from Delhi.",
  url: SITE_URL,
  image: `${SITE_URL}/images/hero-1.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Delhi",
    addressCountry: "IN",
  },
};

const whyItems = [
  { icon: <FiShield size={15} />, title: "Quality checked", description: "Every component gets the attention it deserves." },
  { icon: <FiTarget size={15} />, title: "Made to measure", description: "Clear dimensions, clean work, no guesswork." },
  { icon: <FiUsers size={15} />, title: "One capable partner", description: "Design support through fabrication and finish." },
];

export default function Home() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/products?featured=true")
      .then((res) => {
        if (!mounted) return;
        if (res.data.length) {
          setProducts(res.data);
        } else {
          api.get("/products").then((r2) => mounted && setProducts(r2.data.slice(0, 6)));
        }
      })
      .catch(() => mounted && setProducts([]));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Seo
        title="Precision Fabrication & Custom Manufacturing"
        description="FAB Engineering provides laser cutting, sheet metal fabrication, bending, powder coating and custom engineering solutions from Delhi."
        path="/"
        jsonLd={localBusinessJsonLd}
      />
      <Hero />

      {/* Capabilities preview */}
      <section className="border-b border-white/10 bg-bg py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow mb-4">CAPABILITIES</div>
              <h2 className="heading-display text-4xl text-white sm:text-5xl">
                Made for the <br /> work ahead.
              </h2>
            </div>
            <p className="max-w-xs text-sm text-white/50 lg:text-right">
              Focused services for fabrication teams, product builders and engineers.
            </p>
          </div>

          {products === null ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <ServiceCard
                  key={p._id}
                  number={i + 1}
                  title={p.name}
                  description={p.shortDescription}
                  to={`/services/${p.slug}`}
                  index={i}
                  ctaLabel="View capability"
                />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/services" className="btn-outline">
              View all services <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why FAB */}
      <FeatureListSection
        eyebrow="WHY FAB"
        heading="Small details."
        accentWord="Big difference."
        image="/images/workshop.jpg"
        items={whyItems}
        ctaLabel="More about us"
        ctaTo="/about"
      />

      <CTABanner />
    </div>
  );
}
