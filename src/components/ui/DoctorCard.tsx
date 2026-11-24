import { Building2, MapPin, Video } from "lucide-react";
import type { Doctor } from "@/types";
import { consultationLabel, cx, formatFee } from "@/lib/format";
import { Badge, LiveDot } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { Stars } from "@/components/ui/Stars";

export function DoctorCard({ doctor, className }: { doctor: Doctor; className?: string }) {
  return (
    <article
      className={cx(
        "group flex h-full min-w-0 flex-col rounded-card border border-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] bg-white p-5 shadow-soft transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <DoctorAvatar doctor={doctor} size={64} rounded="card" />
          {doctor.online && (
            <span
              className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-white"
              title="Online now"
            >
              <LiveDot />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[1.0625rem] font-semibold text-ink">{doctor.name}</h3>
          <p className="mt-0.5 text-sm font-medium text-electric">{doctor.specialty}</p>
          <p className="mt-1 truncate text-xs text-ink-faint">
            {doctor.qualifications.join(", ")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <Stars rating={doctor.rating} />
        <span className="font-semibold text-ink">{doctor.rating.toFixed(1)}</span>
        <span className="text-ink-faint">({doctor.reviewCount} reviews)</span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-ink-soft">
        <div className="flex items-center gap-2">
          <Building2 size={15} className="shrink-0 text-ink-faint" />
          <dt className="sr-only">Hospital</dt>
          <dd className="truncate">{doctor.hospital}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-ink-faint" />
          <dt className="sr-only">Location</dt>
          <dd>
            {doctor.location} · {doctor.experienceYears} yrs experience
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {doctor.consultationTypes.map((type) => (
          <span
            key={type}
            className="inline-flex items-center gap-1 rounded-chip bg-ice px-2 py-1 text-[0.6875rem] font-semibold text-ink-soft"
          >
            {type === "video" && <Video size={11} />}
            {consultationLabel[type]}
          </span>
        ))}
      </div>

      <div className="mt-5 flex min-w-0 flex-wrap items-end justify-between gap-3 border-t hairline pt-4">
        <div>
          <p className="text-xs text-ink-faint">Consultation</p>
          <p className="font-display text-xl font-semibold text-ink">
            {formatFee(doctor.consultationFee)}
          </p>
        </div>
        {doctor.availableToday ? (
          <Badge tone="mint">
            <LiveDot />
            {doctor.nextSlot}
          </Badge>
        ) : (
          <Badge>{doctor.nextSlot}</Badge>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ButtonLink href={`/doctors/${doctor.slug}`} variant="secondary" size="sm">
          View profile
        </ButtonLink>
        <ButtonLink href={`/appointments/book?doctor=${doctor.slug}`} size="sm">
          Book
        </ButtonLink>
      </div>
    </article>
  );
}
