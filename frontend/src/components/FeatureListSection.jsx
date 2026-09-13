import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

export default function FeatureListSection({
  eyebrow,
  heading,
  accentWord,
  image,
  items,
  ctaLabel,
  ctaTo,
  imageOnRight = false,
}) {
  const imageBlock = (
    <motion.div
      initial={{ opacity: 0, x: imageOnRight ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-[320px] overflow-hidden lg:min-h-[560px]"
    >
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
    </motion.div>
  );

  const contentBlock = (
    <motion.div
      initial={{ opacity: 0, x: imageOnRight ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="eyebrow mb-5">{eyebrow}</div>
      <h2 className="heading-display text-4xl text-white sm:text-5xl">
        <span className="block">{heading}</span>
        <span className="block text-red">{accentWord}</span>
      </h2>

      <div className="mt-9 divide-y divide-white/10 border-t border-white/10">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-4 py-5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red/40 text-red">
              {item.icon}
            </span>
            <div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/50">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {ctaTo && (
        <Link
          to={ctaTo}
          className="mt-8 inline-flex w-fit items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-white hover:text-red"
        >
          {ctaLabel} <FiArrowUpRight />
        </Link>
      )}
    </motion.div>
  );

  return (
    <section className="border-b border-white/10 bg-bg">
      <div className="grid lg:grid-cols-2">
        {imageOnRight ? (
          <>
            {contentBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {contentBlock}
          </>
        )}
      </div>
    </section>
  );
}
