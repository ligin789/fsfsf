import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { ReactNode, CSSProperties } from "react";

interface TiltCardProps {
  children: ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Max tilt angle */
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
}

export default function TiltCard({
  children,
  delay = 0,
  className,
  style,
  tiltMaxAngleX = 6,
  tiltMaxAngleY = 6,
}: TiltCardProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={
        prefersReduced
          ? undefined
          : {
              scale: 1.03,
              boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
              transition: { duration: 0.25 },
            }
      }
      className={className}
      style={{ ...style, willChange: "transform, opacity" }}
    >
      {prefersReduced ? (
        children
      ) : (
        <Tilt
          tiltMaxAngleX={tiltMaxAngleX}
          tiltMaxAngleY={tiltMaxAngleY}
          scale={1}
          transitionSpeed={300}
          glareEnable={false}
          style={{ width: "100%", height: "100%" }}
        >
          {children}
        </Tilt>
      )}
    </motion.div>
  );
}
