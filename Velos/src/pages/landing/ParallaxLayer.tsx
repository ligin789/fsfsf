import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface ParallaxLayerProps {
  children: ReactNode;
  /** Speed factor — positive = moves slower (parallax), negative = moves faster */
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function ParallaxLayer({
  children,
  speed = 0.2,
  className,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -80, speed * 80]);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
