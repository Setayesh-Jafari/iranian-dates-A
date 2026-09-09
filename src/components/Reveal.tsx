"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { EASE } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // The reveal animation is a progressive enhancement: it may only hide its
  // children once the client is running and can animate them back in. Rendering
  // `opacity: 0` on the server would leave the whole page invisible for anyone
  // whose JS has not executed (hydration error, blocked/failed chunk, crawler),
  // which is exactly how the homepage appeared to be "empty".
  const [canAnimate, setCanAnimate] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setCanAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (reduce || !canAnimate) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
