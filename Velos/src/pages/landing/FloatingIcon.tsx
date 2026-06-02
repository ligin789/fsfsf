import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface FloatingIconProps {
  children: ReactNode;
  /** Amplitude in px (how far it moves) */
  amplitude?: number;
  /** Duration of one full cycle in seconds */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function FloatingIcon({
  children,
  amplitude = 6,
  duration = 3,
  delay = 0,
  className,
  style,
}: FloatingIconProps) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{ ...style, willChange: "transform" }}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
