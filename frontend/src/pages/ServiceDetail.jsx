import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiCheck, FiMessageCircle, FiArrowLeft } from "react-icons/fi";
import ServiceCard from "../components/ServiceCard";
import CTABanner from "../components/CTABanner";
import { resolveImage } from "../utils/resolveImage";
import { buildWhatsAppLink } from "../utils/whatsapp";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";
import Seo from "../components/Seo";

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setActiveImage(0);
    api
      .get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setRelated(res.related || []);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <Seo title="Service Not Found" path={`/services/${slug}`} noindex />
        <h1 className="heading-display text-3xl text-white">Service not found</h1>
        <p className="mt-3 text-white/50">This service may have been renamed or removed.</p>
        <Link to="/services" className="btn-outline mt-6 inline-flex">
          <FiArrowLeft /> Back to services
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-24 sm:px-8">
        <div className="h-6 w-40 rounded bg-white/10" />
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] rounded-xl bg-white/5" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-5/6 rounded bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/images/hero-1.jpg"];

  return (
    <div>
      <Seo
        title={product.name}
        description={product.description?.slice(0, 155) || `${product.name} — a fabrication service from FAB Engineering.`}
        path={`/services/${product.slug || slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: product.name,
          description: product.description,
          provider: { "@type": "LocalBusiness", name: "FAB Engineering" },
        }}
      />
      <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
          <FiArrowLeft size={14} /> All services
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img src={resolveImage(images[activeImage])} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${
                      i === activeImage ? "border-red" : "border-white/10"
                    }`}
                  >
                    <img src={resolveImage(img)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/50">
              {product.category}
            </span>
            <h1 className="heading-display mt-4 text-3xl text-white sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-white/60">{product.description}</p>

            {product.price && (
              <p className="mt-4 text-lg font-bold text-white">
                Starting at ₹{product.price.toLocaleString("en-IN")}
              </p>
            )}

            {product.features?.length > 0 && (
              <ul className="mt-6 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <FiCheck className="mt-0.5 shrink-0 text-red" /> {f}
                  </li>
                ))}
              </ul>
            )}

            {product.specifications?.length > 0 && (
              <div className="mt-8 divide-y divide-white/10 rounded-lg border border-white/10">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-white/40">{spec.key}</span>
                    <span className="font-medium text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/quote?product=${product.slug}`)}
                className="btn-primary"
              >
                Request quote for this service <FiArrowUpRight />
              </button>
              <a
                href={buildWhatsAppLink(settings.whatsapp, product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <FiMessageCircle /> WhatsApp us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/10 bg-bg py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="heading-display mb-8 text-2xl text-white sm:text-3xl">Related services</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ServiceCard
                  key={p._id}
                  number={i + 1}
                  title={p.name}
                  description={p.shortDescription}
                  to={`/services/${p.slug}`}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </div>
  );
}
