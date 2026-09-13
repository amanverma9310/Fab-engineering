import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, heading, accentLine, text }) {
  return (
    <section className="border-b border-white/10 bg-bg py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl px-5 sm:px-8"
      >
        <div className="eyebrow mb-5">{eyebrow}</div>
        <h1 className="heading-display text-4xl text-white sm:text-6xl">
          <span className="block">{heading}</span>
          {accentLine && <span className="block text-red">{accentLine}</span>}
        </h1>
        {text && <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">{text}</p>}
      </motion.div>
    </section>
  );
}
