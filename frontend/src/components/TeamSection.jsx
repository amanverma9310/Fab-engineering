import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLinkedin } from "react-icons/fi";
import api from "../services/api";
import { resolveImage } from "../utils/resolveImage";

export default function TeamSection() {
  const [members, setMembers] = useState(null);

  useEffect(() => {
    api.get("/team").then((res) => setMembers(res.data)).catch(() => setMembers([]));
  }, []);

  // Nothing to show yet (no team members added in admin) — hide the whole
  // section rather than displaying an empty grid.
  if (members !== null && members.length === 0) return null;

  return (
    <section className="border-b border-white/10 bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12">
          <div className="eyebrow mb-5">THE TEAM</div>
          <h2 className="heading-display text-4xl text-white sm:text-5xl">
            <span className="block">People behind</span>
            <span className="block text-red">the work.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {members === null
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-white/5" />
                  <div className="mt-3 h-4 w-2/3 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
                </div>
              ))
            : members.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.06 }}
                >
                  <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    <img src={resolveImage(m.photo)} alt={m.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{m.name}</h3>
                      <p className="text-xs text-white/45">{m.role}</p>
                    </div>
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 shrink-0 text-white/40 hover:text-red"
                        aria-label={`${m.name} on LinkedIn`}
                      >
                        <FiLinkedin size={15} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
