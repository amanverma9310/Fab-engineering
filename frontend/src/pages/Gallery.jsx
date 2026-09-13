import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { GridSkeleton } from "../components/Skeletons";
import { resolveImage } from "../utils/resolveImage";
import api from "../services/api";

export default function Gallery() {
  const [images, setImages] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get("/gallery").then((res) => setImages(res.data)).catch(() => setImages([]));
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="THE WORKSHOP"
        heading="Made visible."
        accentLine="Made well."
        text="A look at the process, the place and the finished details behind our work."
      />

      <section className="bg-bg py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {images === null ? (
            <GridSkeleton count={6} />
          ) : images.length === 0 ? (
            <EmptyState message="Gallery images will appear here as the workshop archive grows." />
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {images.map((img, i) => (
                <motion.button
                  key={img._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                  onClick={() => setLightbox(img)}
                  className="group block w-full overflow-hidden rounded-xl border border-white/10"
                >
                  <img
                    src={resolveImage(img.image)}
                    alt={img.caption || ""}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-6 top-6 text-white/70 hover:text-white"
              aria-label="Close"
            >
              <FiX size={26} />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              src={resolveImage(lightbox.image)}
              alt={lightbox.caption || ""}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {lightbox.caption && (
              <p className="absolute bottom-8 text-sm text-white/70">{lightbox.caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
