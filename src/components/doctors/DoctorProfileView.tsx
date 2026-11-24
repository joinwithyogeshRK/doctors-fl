"use client";

import { useEffect } from "react";
import {
  Award,
  BadgeCheck,
  CalendarPlus,
  Building2,
  Check,
  FileText,
  Heart,
  Languages,
  MapPin,
  Share2,
  Sparkles,
} from "lucide-react";
import type { Doctor } from "@/types";
import type { DoctorProfile } from "@/data/doctorProfiles";
import { cx, formatFee } from "@/lib/format";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { Stars } from "@/components/ui/Stars";
import { Badge, LiveDot } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Surfaces";
import { Tabs } from "@/components/ui/Tabs";
import { BookingPanel } from "@/components/doctors/BookingPanel";
import { ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import {
  rememberDoctor,
  toggleFavouriteDoctor,
  useFavouriteDoctors,
} from "@/store/wishlist";

export function DoctorProfileView({
  doctor,
  profile,
}: {
  doctor: Doctor;
  profile: DoctorProfile;
}) {
  const favourites = useFavouriteDoctors();
  const { toast } = useToast();
  const isFavourite = favourites.includes(doctor.slug);

  useEffect(() => {
    rememberDoctor(doctor.slug);
  }, [doctor.slug]);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: doctor.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("success", "Link copied", "Share this profile with anyone.");
    } catch {
      toast("error", "Couldn't share", "Copy the address from your browser bar instead.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8 xl:grid-cols-[1fr_24rem]">
      <div className="min-w-0">
        {/* Identity */}
        <Card className="overflow-hidden" padded={false}>
          <div className="relative h-28 bg-[linear-gradient(118deg,#132252,#23215f_55%,#3b2064)]">
            <span className="absolute -top-10 -left-6 h-40 w-40 rounded-full bg-electric/35 blur-3xl" />
          </div>
          <div className="px-5 pt-0 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-wrap items-end gap-5">
              <DoctorAvatar
                doctor={doctor}
                size={104}
                rounded="card"
                className="ring-4 ring-white"
              />
              <div className="flex flex-1 flex-wrap items-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    toggleFavouriteDoctor(doctor.slug);
                    toast(
                      "success",
                      isFavourite ? "Removed from your doctors" : "Saved to your doctors",
                    );
                  }}
                  aria-pressed={isFavourite}
                  className={cx(
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                    isFavourite
                      ? "border-coral bg-[color-mix(in_oklab,var(--color-coral)_10%,white)] text-coral"
                      : "hairline bg-white text-ink-soft hover:border-coral hover:text-coral",
                  )}
                >
                  <Heart size={15} className={isFavourite ? "fill-coral" : ""} />
                  {isFavourite ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex h-10 items-center gap-2 rounded-full border hairline bg-white px-4 text-sm font-semibold text-ink-soft transition-colors hover:border-electric hover:text-electric"
                >
                  <Share2 size={15} />
                  Share
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-3xl font-bold text-ink">{doctor.name}</h1>
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--color-electric)_12%,white)] px-2.5 py-1 text-xs font-semibold text-electric-dark"
                  title="Credentials verified by Meridian Health"
                >
                  <BadgeCheck size={13} />
                  Verified
                </span>
                {doctor.online && (
                  <Badge tone="mint">
                    <LiveDot />
                    Online now
                  </Badge>
                )}
              </div>

              <p className="mt-1.5 text-base font-medium text-electric">{doctor.specialty}</p>
              <p className="mt-1 text-sm text-ink-soft">{doctor.qualifications.join(", ")}</p>

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <dt className="text-xs text-ink-faint">Experience</dt>
                  <dd className="font-display mt-0.5 text-lg font-semibold text-ink">
                    {doctor.experienceYears} years
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Rating</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <Stars rating={doctor.rating} size={15} />
                    <span className="font-display text-lg font-semibold text-ink">
                      {doctor.rating}
                    </span>
                    <span className="text-xs text-ink-faint">({doctor.reviewCount})</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Next available</dt>
                  <dd className="font-display mt-0.5 text-lg font-semibold text-ink">
                    {doctor.nextSlot}
                  </dd>
                </div>
              </dl>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 border-t hairline pt-5 text-sm text-ink-soft">
                <li className="flex items-center gap-2">
                  <Building2 size={15} className="text-ink-faint" />
                  {doctor.hospital}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={15} className="text-ink-faint" />
                  {doctor.location}
                </li>
                <li className="flex items-center gap-2">
                  <Languages size={15} className="text-ink-faint" />
                  {doctor.languages.join(", ")}
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Tabs
          className="mt-6"
          items={[
            {
              id: "overview",
              label: "Overview",
              content: <Overview doctor={doctor} profile={profile} />,
            },
            {
              id: "experience",
              label: "Experience",
              content: <ExperienceTab profile={profile} />,
            },
            {
              id: "education",
              label: "Education",
              content: <EducationTab profile={profile} />,
            },
            {
              id: "reviews",
              label: `Reviews (${doctor.reviewCount})`,
              content: <ReviewsTab doctor={doctor} profile={profile} />,
            },
            { id: "faqs", label: "FAQs", content: <FaqTab profile={profile} /> },
          ]}
        />
      </div>

      {/* Sticky booking rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <BookingPanel doctor={doctor} />
      </aside>

      {/* Mobile: the fee and a book button stay in reach while reading */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-white/92 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6875rem] text-ink-faint">Consultation</p>
            <p className="font-display text-lg leading-tight font-bold text-ink">
              {formatFee(doctor.consultationFee)}
            </p>
          </div>
          <ButtonLink href={`/appointments/book?doctor=${doctor.slug}`} className="shrink-0">
            <CalendarPlus size={16} />
            Book appointment
          </ButtonLink>
        </div>
      </div>
      {/* Spacer so the bar never covers the last card */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </div>
  );
}

function PillList({ items, tone = "ice" }: { items: string[]; tone?: "ice" | "mint" }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={cx(
            "rounded-chip px-3 py-1.5 text-[0.8125rem] font-medium",
            tone === "ice"
              ? "bg-ice text-ink-soft"
              : "bg-[color-mix(in_oklab,var(--color-mint)_12%,white)] text-[color-mix(in_oklab,var(--color-mint)_82%,black)]",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Overview({ doctor, profile }: { doctor: Doctor; profile: DoctorProfile }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardTitle>About {doctor.name}</CardTitle>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{doctor.bio}</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Medical expertise</CardTitle>
          <PillList items={doctor.expertise} />
        </Card>
        <Card>
          <CardTitle>Conditions treated</CardTitle>
          <PillList items={profile.conditions.slice(0, 8)} />
        </Card>
      </div>

      <Card>
        <CardTitle>Procedures performed</CardTitle>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {profile.procedures.map((procedure) => (
            <li key={procedure} className="flex items-center gap-2.5 text-sm text-ink-soft">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
                <Check size={12} />
              </span>
              {procedure}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ExperienceTab({ profile }: { profile: DoctorProfile }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardTitle>Hospital appointments</CardTitle>
        <ol className="space-y-6">
          {profile.experience.map((entry) => (
            <li key={entry.years} className="relative flex gap-5">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-electric ring-4 ring-[color-mix(in_oklab,var(--color-electric)_14%,white)]" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink-faint tnum">{entry.years}</p>
                <p className="mt-0.5 font-semibold text-ink">{entry.role}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{entry.place}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Awards</CardTitle>
          <ul className="space-y-3.5">
            {profile.awards.map((award) => (
              <li key={award} className="flex gap-3 text-sm text-ink-soft">
                <Award size={16} className="mt-0.5 shrink-0 text-amber" />
                {award}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Publications</CardTitle>
          <ul className="space-y-3.5">
            {profile.publications.map((paper) => (
              <li key={paper} className="flex gap-3 text-sm text-ink-soft">
                <FileText size={16} className="mt-0.5 shrink-0 text-violet" />
                {paper}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function EducationTab({ profile }: { profile: DoctorProfile }) {
  return (
    <Card>
      <CardTitle>Qualifications</CardTitle>
      <ol className="space-y-6">
        {profile.education.map((entry) => (
          <li key={entry.qualification} className="flex gap-5">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-violet ring-4 ring-[color-mix(in_oklab,var(--color-violet)_14%,white)]" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink-faint tnum">{entry.years}</p>
              <p className="mt-0.5 font-semibold text-ink">{entry.qualification}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{entry.institution}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function ReviewsTab({ doctor, profile }: { doctor: Doctor; profile: DoctorProfile }) {
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center gap-8">
        <div>
          <p className="font-display text-4xl font-bold text-ink">{doctor.rating}</p>
          <Stars rating={doctor.rating} size={15} className="mt-1.5" />
          <p className="mt-1.5 text-xs text-ink-faint">{doctor.reviewCount} verified reviews</p>
        </div>
        <div className="min-w-[12rem] flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const share = star === 5 ? 82 : star === 4 ? 13 : star === 3 ? 3 : star === 2 ? 1 : 1;
            return (
              <div key={star} className="flex items-center gap-2.5 text-xs text-ink-faint">
                <span className="w-3 tnum">{star}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ice">
                  <span
                    className="block h-full rounded-full bg-amber"
                    style={{ width: `${share}%` }}
                  />
                </span>
                <span className="w-8 text-right tnum">{share}%</span>
              </div>
            );
          })}
        </div>
      </Card>

      {profile.reviews.map((review) => (
        <Card key={review.id}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-sm font-semibold text-white">
              {review.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{review.name}</p>
              <p className="text-xs text-ink-faint">
                {review.type} consultation · {review.date}
              </p>
            </div>
            <Stars rating={review.rating} size={14} />
          </div>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{review.body}</p>
        </Card>
      ))}

      <p className="rounded-card bg-mist px-5 py-4 text-xs leading-relaxed text-ink-soft">
        Reviews shown here are written for this demonstration. In a live deployment they would be
        collected after completed consultations and moderated before publication.
      </p>
    </div>
  );
}

function FaqTab({ profile }: { profile: DoctorProfile }) {
  return (
    <Card padded={false}>
      <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_8%,transparent)]">
        {profile.faqs.map((faq) => (
          <li key={faq.question}>
            <details className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:hidden">
                {faq.question}
                <Sparkles
                  size={16}
                  className="shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-90 group-open:text-electric"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export { PillList };
