import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export default function CTABanner({
  eyebrow = "READY WHEN YOU ARE",
  line1 = "Have a drawing?",
  line2 = "Let's make it happen.",
  ctaLabel = "Start a quote",
  ctaTo = "/quote",
}) {
  return (
    <section className="border-b border-white/10 bg-bg py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-5 text-center"
      >
        <div className="eyebrow mx-auto mb-5 w-fit">{eyebrow}</div>
        <h2 className="heading-display text-4xl text-white sm:text-6xl">
          <span className="block">{line1}</span>
          <span className="block text-red">{line2}</span>
        </h2>
        <Link to={ctaTo} className="btn-primary mt-9">
          {ctaLabel} <FiArrowUpRight />
        </Link>
      </motion.div>
    </section>
  );
}
