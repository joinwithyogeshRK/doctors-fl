"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
}

/** Counts to `value` the first time it scrolls into view. */
export function CountUp({ value, suffix = "", duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  // Reduced motion skips the count entirely rather than animating to the same place.
  const shown = reduce ? value : display;

  return (
    <span ref={ref} className="tnum">
      {shown.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
