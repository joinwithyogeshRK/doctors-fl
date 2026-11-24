/**
 * Categorical series colours, in fixed assignment order.
 *
 * Validated with the dataviz six-checks against the light chart surface:
 * lightness band PASS, chroma floor PASS, CVD separation PASS
 * (worst adjacent pair ΔE 21.8 deutan), normal-vision floor PASS,
 * contrast vs surface PASS (all ≥ 3:1).
 *
 * Assign by series identity and never cycle — a sixth series folds into
 * "Other" (neutral) rather than generating a new hue.
 */
export const SERIES = ["#1b63ff", "#0a8f66", "#7a4dff", "#d97a12", "#b23d8c"] as const;

/** Reserved for the "Other" bucket only — never a sixth identity. */
export const OTHER = "#8b97b4";

/** Single hue, light to dark, for magnitude. */
export const SEQUENTIAL = ["#dbe6ff", "#a9c2ff", "#6f98ff", "#3a74ff", "#1b63ff", "#0b47d0"];

export function seriesColor(index: number): string {
  return index < SERIES.length ? SERIES[index] : OTHER;
}

export const AXIS = "color-mix(in oklab, var(--color-ink) 42%, transparent)";
export const GRID = "color-mix(in oklab, var(--color-ink) 9%, transparent)";
