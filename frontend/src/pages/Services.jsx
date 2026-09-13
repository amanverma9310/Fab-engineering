import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ServiceCard from "../components/ServiceCard";
import CTABanner from "../components/CTABanner";
import EmptyState from "../components/EmptyState";
import { GridSkeleton } from "../components/Skeletons";
import api from "../services/api";
import Seo from "../components/Seo";

export default function Services() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <Seo
        title="Our Services"
        description="Explore FAB Engineering's fabrication services including laser cutting, sheet metal bending and powder coating."
        path="/services"
      />
      <PageHeader
        eyebrow="OUR CAPABILITIES"
        heading="Engineering that meets"
        accentLine="the brief."
        text="A practical range of capabilities for custom parts, prototypes and production-ready fabrication."
      />

      <section className="bg-bg py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {error && <p className="mb-6 text-sm text-red">{error}</p>}

          {products === null ? (
            <GridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState message="Services are being added." actionLabel="Get in touch" actionTo="/contact" />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <ServiceCard
                  key={p._id}
                  number={i + 1}
                  title={p.name}
                  description={p.shortDescription}
                  tags={(p.features || []).slice(0, 2)}
                  to={`/services/${p.slug}`}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner
        line1="Not sure which service"
        line2="fits your job?"
        ctaLabel="Talk to us"
        ctaTo="/contact"
      />
    </div>
  );
}
