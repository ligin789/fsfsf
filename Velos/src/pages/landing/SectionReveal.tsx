import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ReactNode, CSSProperties } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Stagger children by this many seconds each */
  stagger?: number;
}

/**
 * Wraps a section and applies a subtle reveal (opacity + upward slide)
 * when it enters the viewport.
 */
export default function SectionReveal({
  children,
  className,
  style,
  stagger = 0.08,
}: SectionRevealProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Wrap each child of SectionReveal in this for staggered entrance */
export function RevealItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
