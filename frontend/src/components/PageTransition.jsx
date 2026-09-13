import { motion } from "framer-motion";

// Wraps each page so navigating anywhere from the navbar (or any Link)
// enters with a short, subtle "drop down from the top" animation instead of
// an abrupt cut. Kept short and professional — no bounce, no continuous motion.
const variants = {
  initial: { opacity: 0, y: -18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
