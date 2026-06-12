import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-cream.png";

export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 1400));
    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    Promise.all([minDelay, pageReady]).then(() => setVisible(false));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal"
        >
          <motion.img
            src={logo}
            alt="Manjar do Ramos"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: [0.88, 1, 0.97, 1] }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-44 object-contain md:w-56"
          />
          <div className="mt-10 flex gap-2.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-1.5 w-1.5 rounded-full bg-gold/70"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.28,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
