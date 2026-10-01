import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

// Wraps each page so navigating anywhere from the navbar (or any Link)
// enters with a short, subtle "drop down from the top" animation instead of
// an abrupt cut. Kept short and professional — no bounce, no continuous motion.
const variants = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export default function PageTransition({ children }) {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0.01 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
