import Image from "next/image";
import type { Doctor } from "@/types";
import { cx, initials } from "@/lib/format";

/** Specialty-tinted gradient pairs, keyed to the accent tokens. */
const tint: Record<string, [string, string]> = {
  cardiology: ["#ff8a8d", "#e5484d"],
  neurology: ["#a98bff", "#7a4dff"],
  orthopedics: ["#6dc3f5", "#0b7fd4"],
  pediatrics: ["#ffc06b", "#f2922c"],
  dermatology: ["#f291cf", "#d44aa0"],
  dentistry: ["#6fd9e6", "#11a3b8"],
  "general-medicine": ["#7fa8ff", "#1b63ff"],
  gynecology: ["#e68fc6", "#c0479a"],
  ophthalmology: ["#7fd0b2", "#2a8f6b"],
  ent: ["#a79cf0", "#6b5bd2"],
  psychiatry: ["#8a79e8", "#4a33cf"],
  gastroenterology: ["#e3b075", "#c07a2c"],
};

interface DoctorAvatarProps {
  doctor: Doctor;
  size?: number;
  className?: string;
  rounded?: "full" | "card";
}

/**
 * Portrait when the practice has supplied one, otherwise a generated
 * monogram tinted to the doctor's specialty — so a roster with missing
 * photos still looks deliberate rather than broken.
 */
export function DoctorAvatar({
  doctor,
  size = 56,
  className,
  rounded = "full",
}: DoctorAvatarProps) {
  const [from, to] = tint[doctor.specialtySlug] ?? tint["general-medicine"];
  const radius = rounded === "full" ? "rounded-full" : "rounded-2xl";

  if (doctor.profileImage) {
    return (
      <span
        className={cx("relative block overflow-hidden bg-ice", radius, className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={doctor.profileImage}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover object-top"
        />
      </span>
    );
  }

  return (
    <span
      className={cx(
        "relative grid shrink-0 place-items-center overflow-hidden font-display font-semibold text-white",
        radius,
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background: `linear-gradient(145deg, ${from}, ${to})`,
      }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 0%, rgb(255 255 255 / 0.9), transparent 60%)",
        }}
      />
      <span className="relative tracking-tight">{initials(doctor.name)}</span>
    </span>
  );
}
