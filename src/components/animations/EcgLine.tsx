"use client";

import { useReducedMotion } from "motion/react";

interface EcgLineProps {
  className?: string;
  stroke?: string;
  /** Seconds for one sweep. */
  speed?: number;
  strokeWidth?: number;
}

const TRACE =
  "M0 40 H58 l9 -16 7 32 8 -46 9 62 8 -32 h10 l7 -10 6 10 H160 l9 -16 7 32 8 -46 9 62 8 -32 h10 l7 -10 6 10 H320 l9 -16 7 32 8 -46 9 62 8 -32 h10 l7 -10 6 10 H480";

/**
 * The single piece of continuous ambient motion on the page: a heartbeat
 * trace sweeping left to right. Freezes flat for reduced-motion users.
 */
export function EcgLine({
  className,
  stroke = "var(--color-electric)",
  speed = 3.2,
  strokeWidth = 2,
}: EcgLineProps) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 480 80"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path d={TRACE} stroke={stroke} strokeOpacity={0.22} strokeWidth={strokeWidth} />
      {!reduce && (
        <path
          d={TRACE}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="0.22 0.78"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1"
            to="0"
            dur={`${speed}s`}
            repeatCount="indefinite"
          />
        </path>
      )}
    </svg>
  );
}
