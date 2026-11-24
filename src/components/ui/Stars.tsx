import { Star } from "lucide-react";
import { cx } from "@/lib/format";

export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={i <= Math.round(rating) ? "fill-amber" : "fill-[#d8dfee]"}
        />
      ))}
    </span>
  );
}
