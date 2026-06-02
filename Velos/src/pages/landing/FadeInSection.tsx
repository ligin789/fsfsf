import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ReactNode, CSSProperties } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  /** Direction the element slides in from */
  direction?: "up" | "down" | "left" | "right";
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Distance in px */
  distance?: number;
  /** Extra className */
  className?: string;
  /** Extra inline styles */
  style?: CSSProperties;
  /** Trigger only once */
  once?: boolean;
}

const offsets = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export default function FadeInSection({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance,
  className,
  style,
  once = true,
}: FadeInSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.15,
  });

  const base = offsets[direction];
  const scale = distance ? distance / 40 : 1;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, x: base.x * scale, y: base.y * scale }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
