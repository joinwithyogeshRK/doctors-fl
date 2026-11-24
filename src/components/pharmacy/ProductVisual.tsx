import {
  Baby,
  Bandage,
  Droplet,
  HeartPulse,
  Pill,
  Snowflake,
  Sparkles,
  Syringe,
  Thermometer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Medicine, MedicineCategory } from "@/types";
import { cx } from "@/lib/format";

const art: Record<MedicineCategory, { icon: LucideIcon; from: string; to: string }> = {
  "pain-relief": { icon: Pill, from: "#7fa8ff", to: "#1b63ff" },
  "cold-and-flu": { icon: Snowflake, from: "#6fd9e6", to: "#11a3b8" },
  vitamins: { icon: Sparkles, from: "#ffc06b", to: "#f2922c" },
  "diabetes-care": { icon: Droplet, from: "#a98bff", to: "#7a4dff" },
  "heart-health": { icon: HeartPulse, from: "#ff8a8d", to: "#e5484d" },
  "skin-care": { icon: Sparkles, from: "#f291cf", to: "#d44aa0" },
  "baby-care": { icon: Baby, from: "#7fd0b2", to: "#2a8f6b" },
  "first-aid": { icon: Bandage, from: "#8a9bd6", to: "#4a33cf" },
  devices: { icon: Thermometer, from: "#6dc3f5", to: "#0b7fd4" },
};

/**
 * Catalogue imagery is generated rather than photographed: a category-tinted
 * tile with the product's initials. Keeps a 38-item catalogue visually
 * consistent and avoids stand-in stock photos of real medicine packs.
 */
export function ProductVisual({
  item,
  className,
  size = "md",
}: {
  item: Medicine;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { icon: Icon, from, to } = art[item.category] ?? art["pain-relief"];
  const iconSize = { sm: 22, md: 34, lg: 58 }[size];
  const initials = item.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cx("relative grid place-items-center overflow-hidden", className)}
      style={{ background: `linear-gradient(150deg, ${from}1f, ${to}2e)` }}
      aria-hidden="true"
    >
      <span
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-45 blur-2xl"
        style={{ background: to }}
      />
      <span
        className="relative grid place-items-center rounded-2xl bg-white/70 shadow-[0_8px_20px_-10px_rgb(10_26_60/0.4)] backdrop-blur-sm"
        style={{
          width: iconSize * 1.9,
          height: iconSize * 1.9,
          color: to,
        }}
      >
        <Icon size={iconSize} strokeWidth={1.6} />
      </span>
      {size !== "sm" && (
        <span
          className="absolute bottom-2 left-2.5 font-display text-[0.625rem] font-bold tracking-wider opacity-50"
          style={{ color: to }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

export { Syringe };
