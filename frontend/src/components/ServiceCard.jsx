import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export default function ServiceCard({ number, title, description, tags = [], to, index = 0, ctaLabel = "Discover" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
    >
      <Link
        to={to}
        className="card group flex h-full flex-col justify-between p-6 hover:border-red/40 hover:bg-white/[0.04] sm:p-7"
      >
        <div>
          <span className="font-display text-sm text-red">{String(number).padStart(2, "0")}</span>
          <h3 className="mt-4 text-xl font-bold text-white sm:text-2xl">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/50">{description}</p>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-white group-hover:text-red">
          {ctaLabel} <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}
