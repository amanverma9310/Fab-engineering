import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiChevronRight } from "react-icons/fi";
import { useSettings } from "../context/SettingsContext";

const AUTO_ROTATE_MS = 6000;

export default function Hero() {
  const { settings } = useSettings();

  const slides = [
    {
      eyebrow: `${settings.companyName?.toUpperCase() || "FAB ENGINEERING"} / DELHI`,
      heading: ["Precision", "Engineering.", { text: "Built to perform.", accent: true }],
      text: settings.heroText,
      image: "/images/hero-1.jpg",
      caption: "PRECISION IN EVERY CUT",
      primaryCta: { label: "Request a quote", to: "/quote" },
      secondaryCta: { label: "Explore services", to: "/services" },
    },
    {
      eyebrow: "WHAT WE DO",
      heading: ["From a blank", "sheet to", { text: "something real.", accent: true }],
      text: "We turn drawings, dimensions and ideas into reliable metal components. One capable partner from concept to finished part.",
      image: "/images/hero-2.jpg",
      caption: "CONCEPT TO COMPONENT",
      primaryCta: { label: "Request a quote", to: "/quote" },
      secondaryCta: { label: "Explore services", to: "/services" },
    },
    {
      eyebrow: "READY WHEN YOU ARE",
      heading: ["Have a", { text: "drawing?", accent: false }, { text: "Let's make it happen.", accent: true }],
      text: "Share your requirement and we'll respond with the next best step — no back-and-forth required.",
      image: "/images/hero-3.jpg",
      caption: "FROM DRAWING TO DELIVERY",
      primaryCta: { label: "Start a quote", to: "/quote" },
      secondaryCta: null,
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section className="relative min-h-[88vh] overflow-hidden border-b border-white/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 py-28 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="eyebrow mb-5">{slide.eyebrow}</div>
            <h1 className="heading-display text-[2.6rem] text-white sm:text-6xl md:text-7xl">
              {slide.heading.map((line, i) =>
                typeof line === "string" ? (
                  <span key={i} className="block">
                    {line}
                  </span>
                ) : (
                  <span key={i} className={`block ${line.accent ? "text-red" : "text-white"}`}>
                    {line.text}
                  </span>
                )
              )}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">{slide.text}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to={slide.primaryCta.to} className="btn-primary">
                {slide.primaryCta.label} <FiArrowUpRight />
              </Link>
              {slide.secondaryCta && (
                <Link to={slide.secondaryCta.to} className="btn-outline">
                  {slide.secondaryCta.label} <FiChevronRight />
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 left-5 flex items-center gap-3 sm:left-8">
          <span className="font-display text-sm text-white/70">
            {String(index + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-red" : "w-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>

        <span className="absolute bottom-10 right-5 hidden text-xs font-semibold uppercase tracking-[0.2em] text-white/40 sm:right-8 sm:block">
          {slide.caption}
        </span>
      </div>
    </section>
  );
}
