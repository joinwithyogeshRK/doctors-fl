"use client";

import { Heart, Stethoscope } from "lucide-react";
import { doctorBySlug, doctors } from "@/data/doctors";
import { usePatientAppointments } from "@/store/appointments";
import { useFavouriteDoctors, useRecentDoctors } from "@/store/wishlist";
import { DoctorCard } from "@/components/ui/DoctorCard";
import { EmptyState, PageHeader } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";

export function MyDoctors() {
  const favourites = useFavouriteDoctors();
  const recent = useRecentDoctors();
  const appointments = usePatientAppointments();

  const seen = Array.from(new Set(appointments.map((a) => a.doctorSlug)))
    .map((slug) => doctorBySlug[slug])
    .filter(Boolean);

  const saved = favourites.map((slug) => doctorBySlug[slug]).filter(Boolean);
  const viewed = recent
    .map((slug) => doctorBySlug[slug])
    .filter(Boolean)
    .filter((d) => !favourites.includes(d.slug));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="My doctors"
        lede="Consultants you have seen, saved, or looked at recently."
        action={<ButtonLink href="/doctors" variant="secondary">Find a doctor</ButtonLink>}
      />

      <Section title="Saved doctors" count={saved.length}>
        {saved.length === 0 ? (
          <EmptyState
            icon={<Heart size={22} />}
            title="No saved doctors yet"
            body="Tap Save on any profile and they'll be kept here for quick booking."
            action={<ButtonLink href="/doctors">Browse doctors</ButtonLink>}
          />
        ) : (
          <Grid>
            {saved.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </Grid>
        )}
      </Section>

      <Section title="Doctors you've seen" count={seen.length}>
        {seen.length === 0 ? (
          <EmptyState
            icon={<Stethoscope size={22} />}
            title="No consultations yet"
            body="Once you've had an appointment, that doctor appears here."
          />
        ) : (
          <Grid>
            {seen.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </Grid>
        )}
      </Section>

      {viewed.length > 0 && (
        <Section title="Recently viewed" count={viewed.length}>
          <Grid>
            {viewed.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </Grid>
        </Section>
      )}

      <Section title="Suggested for you" count={3}>
        <Grid>
          {doctors
            .filter((d) => d.availableToday && !favourites.includes(d.slug))
            .slice(0, 3)
            .map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
        </Grid>
      </Section>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-4 flex items-baseline gap-2 text-base font-semibold text-ink">
        {title}
        <span className="text-sm font-normal text-ink-faint tnum">{count}</span>
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}
