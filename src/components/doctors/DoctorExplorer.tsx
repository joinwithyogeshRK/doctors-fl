"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, UserRoundSearch, X } from "lucide-react";
import { doctors } from "@/data/doctors";
import { specialties } from "@/data/specialties";
import { cx } from "@/lib/format";
import { DoctorCard } from "@/components/ui/DoctorCard";
import { EmptyState } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import type { ConsultationType, Doctor } from "@/types";

type Sort = "rating" | "experience" | "fee" | "soonest";

const sorts: { id: Sort; label: string }[] = [
  { id: "rating", label: "Top rated" },
  { id: "experience", label: "Most experienced" },
  { id: "fee", label: "Lowest fee" },
  { id: "soonest", label: "Earliest available" },
];

const experienceBands = [
  { id: "any", label: "Any", min: 0 },
  { id: "5", label: "5+ years", min: 5 },
  { id: "10", label: "10+ years", min: 10 },
  { id: "15", label: "15+ years", min: 15 },
];

const feeBands = [
  { id: "any", label: "Any", max: Infinity },
  { id: "500", label: "Under ₹500", max: 500 },
  { id: "800", label: "Under ₹800", max: 800 },
  { id: "1200", label: "Under ₹1,200", max: 1200 },
];

const allLanguages = Array.from(new Set(doctors.flatMap((d) => d.languages))).sort();

interface Filters {
  specialty: string;
  experience: string;
  fee: string;
  rating: number;
  availableToday: boolean;
  type: ConsultationType | "any";
  gender: "any" | "female" | "male";
  language: string;
}

const emptyFilters: Filters = {
  specialty: "any",
  experience: "any",
  fee: "any",
  rating: 0,
  availableToday: false,
  type: "any",
  gender: "any",
  language: "any",
};

function matches(doctor: Doctor, query: string, filters: Filters): boolean {
  const q = query.trim().toLowerCase();
  if (q) {
    const haystack = [
      doctor.name,
      doctor.specialty,
      doctor.hospital,
      doctor.location,
      ...doctor.expertise,
      ...doctor.qualifications,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.specialty !== "any" && doctor.specialtySlug !== filters.specialty) return false;

  const band = experienceBands.find((b) => b.id === filters.experience);
  if (band && doctor.experienceYears < band.min) return false;

  const fee = feeBands.find((b) => b.id === filters.fee);
  if (fee && doctor.consultationFee > fee.max) return false;

  if (doctor.rating < filters.rating) return false;
  if (filters.availableToday && !doctor.availableToday) return false;
  if (filters.type !== "any" && !doctor.consultationTypes.includes(filters.type)) return false;
  if (filters.gender !== "any" && doctor.gender !== filters.gender) return false;
  if (filters.language !== "any" && !doctor.languages.includes(filters.language)) return false;

  return true;
}

function sortDoctors(list: Doctor[], sort: Sort): Doctor[] {
  const copy = [...list];
  switch (sort) {
    case "experience":
      return copy.sort((a, b) => b.experienceYears - a.experienceYears);
    case "fee":
      return copy.sort((a, b) => a.consultationFee - b.consultationFee);
    case "soonest":
      return copy.sort(
        (a, b) => Number(b.availableToday) - Number(a.availableToday) || b.rating - a.rating,
      );
    default:
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }
}

export function DoctorExplorer() {
  const params = useSearchParams();
  const initialSpecialty = params.get("specialty") ?? "any";

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters, specialty: initialSpecialty });
  const [sort, setSort] = useState<Sort>("rating");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(
    () => sortDoctors(doctors.filter((d) => matches(d, query, filters)), sort),
    [query, filters, sort],
  );

  const activeCount =
    (filters.specialty !== "any" ? 1 : 0) +
    (filters.experience !== "any" ? 1 : 0) +
    (filters.fee !== "any" ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.availableToday ? 1 : 0) +
    (filters.type !== "any" ? 1 : 0) +
    (filters.gender !== "any" ? 1 : 0) +
    (filters.language !== "any" ? 1 : 0);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const panel = (
    <div className="space-y-7">
      <FilterGroup label="Specialty">
        <select
          value={filters.specialty}
          onChange={(e) => set("specialty", e.target.value)}
          aria-label="Filter by specialty"
          className="w-full rounded-xl border hairline bg-white px-3 py-2.5 text-sm text-ink focus:border-electric focus:outline-none"
        >
          <option value="any">All specialties</option>
          {specialties.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Experience">
        <ChipRow
          options={experienceBands.map((b) => ({ value: b.id, label: b.label }))}
          value={filters.experience}
          onChange={(v) => set("experience", v)}
        />
      </FilterGroup>

      <FilterGroup label="Consultation fee">
        <ChipRow
          options={feeBands.map((b) => ({ value: b.id, label: b.label }))}
          value={filters.fee}
          onChange={(v) => set("fee", v)}
        />
      </FilterGroup>

      <FilterGroup label="Minimum rating">
        <ChipRow
          options={[
            { value: "0", label: "Any" },
            { value: "4.5", label: "4.5+" },
            { value: "4.7", label: "4.7+" },
            { value: "4.9", label: "4.9+" },
          ]}
          value={String(filters.rating)}
          onChange={(v) => set("rating", Number(v))}
        />
      </FilterGroup>

      <FilterGroup label="Consultation type">
        <ChipRow
          options={[
            { value: "any", label: "Any" },
            { value: "in-clinic", label: "In clinic" },
            { value: "video", label: "Video" },
            { value: "phone", label: "Phone" },
          ]}
          value={filters.type}
          onChange={(v) => set("type", v as Filters["type"])}
        />
      </FilterGroup>

      <FilterGroup label="Doctor's gender">
        <ChipRow
          options={[
            { value: "any", label: "Any" },
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
          ]}
          value={filters.gender}
          onChange={(v) => set("gender", v as Filters["gender"])}
        />
      </FilterGroup>

      <FilterGroup label="Language">
        <select
          value={filters.language}
          onChange={(e) => set("language", e.target.value)}
          aria-label="Filter by language"
          className="w-full rounded-xl border hairline bg-white px-3 py-2.5 text-sm text-ink focus:border-electric focus:outline-none"
        >
          <option value="any">Any language</option>
          {allLanguages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </FilterGroup>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-mist px-4 py-3">
        <input
          type="checkbox"
          checked={filters.availableToday}
          onChange={(e) => set("availableToday", e.target.checked)}
          className="h-4 w-4 accent-[var(--color-electric)]"
        />
        <span className="text-sm font-medium text-ink">Available today only</span>
      </label>

      {activeCount > 0 && (
        <Button variant="secondary" size="sm" className="w-full" onClick={() => setFilters(emptyFilters)}>
          Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-8">
      {/* Desktop filter rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-card border border-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] bg-white p-5 shadow-soft">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-ink">
            <SlidersHorizontal size={16} className="text-electric" />
            Filters
          </h2>
          {panel}
        </div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, specialty, condition or hospital"
              aria-label="Search doctors"
              className="h-13 w-full rounded-full border hairline bg-white pr-4 pl-11 text-sm text-ink shadow-soft placeholder:text-ink-faint focus:border-electric focus:outline-none"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort results"
            className="h-13 rounded-full border hairline bg-white px-4 text-sm font-medium text-ink shadow-soft focus:border-electric focus:outline-none"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full border hairline bg-white px-5 text-sm font-semibold text-ink shadow-soft lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-electric px-1 text-[0.6875rem] text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        <p className="mt-5 text-sm text-ink-soft" role="status" aria-live="polite">
          <span className="font-semibold text-ink tnum">{results.length}</span>{" "}
          {results.length === 1 ? "doctor" : "doctors"} found
          {query && <> for &ldquo;{query}&rdquo;</>}
        </p>

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<UserRoundSearch size={24} />}
              title="No doctors match those filters"
              body="Try widening the fee range, clearing the specialty, or searching for a condition instead of a name."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFilters(emptyFilters);
                    setQuery("");
                  }}
                >
                  Clear search and filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-panel bg-white p-5 pb-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-semibold text-ink">Filters</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-ice"
                >
                  <X size={18} />
                </button>
              </div>
              {panel}
              <Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>
                Show {results.length} doctors
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold text-ink-soft">{label}</p>
      {children}
    </div>
  );
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cx(
            "rounded-chip px-3 py-1.5 text-xs font-semibold transition-colors",
            value === option.value
              ? "bg-electric text-white"
              : "bg-ice text-ink-soft hover:bg-ice-deep",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
