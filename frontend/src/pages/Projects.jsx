import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import CTABanner from "../components/CTABanner";
import { GridSkeleton } from "../components/Skeletons";
import { resolveImage } from "../utils/resolveImage";
import api from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data)).catch(() => setProjects([]));
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="SELECTED WORK"
        heading="Parts with a"
        accentLine="purpose."
        text="A growing record of components, assemblies and fabrication work. Project stories will grow as we do."
      />

      <section className="bg-bg py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {projects === null ? (
            <GridSkeleton count={4} />
          ) : projects.length === 0 ? (
            <EmptyState
              message="Project case studies are being added."
              actionLabel="Start your project"
              actionTo="/quote"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                  className="card overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white/5">
                    <img
                      src={resolveImage(p.images?.[0])}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    {p.category && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-red">{p.category}</span>
                    )}
                    <h3 className="mt-2 text-xl font-bold text-white">{p.title}</h3>
                    {p.client && <p className="mt-1 text-sm text-white/40">{p.client}</p>}
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
