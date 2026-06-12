import { useEffect, useState } from "react";
import logo from "@/assets/logo-cream.png";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 1400));
    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    Promise.all([minDelay, pageReady]).then(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 800);
    });
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal transition-opacity duration-[800ms] ease-in-out"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <img
        src={logo}
        alt="Manjar do Ramos"
        className="w-44 animate-[loaderPop_0.9s_cubic-bezier(0.22,1,0.36,1)_forwards] object-contain md:w-56"
      />
      <div className="mt-10 flex gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-gold/70 animate-[loaderPulse_1.4s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.28}s` }}
          />
        ))}
      </div>
    </div>
  );
}
