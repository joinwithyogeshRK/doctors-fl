"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Pill, Search, Stethoscope, Tag } from "lucide-react";
import { doctors } from "@/data/doctors";
import { medicines } from "@/data/medicines";
import { specialties } from "@/data/specialties";
import { blogPosts } from "@/data/blog";
import { cx, formatFee } from "@/lib/format";
import { Card, EmptyState } from "@/components/ui/Surfaces";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";

const suggestions = ["Cardiology", "Chest pain", "Paracetamol", "Dr. Rao", "Blood pressure monitor", "Sleep"];

/**
 * Next keeps this component mounted when only the query string changes, so the
 * useState initialisers below would hold on to the previous link's values.
 * Keying on the query gives every incoming link a clean instance.
 */
export function GlobalSearch() {
  const params = useSearchParams();
  return <GlobalSearchInner key={params.toString()} />;
}

function GlobalSearchInner() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;

    return {
      doctors: doctors
        .filter((d) => [d.name, d.specialty, d.hospital, ...d.expertise].join(" ").toLowerCase().includes(q))
        .slice(0, 5),
      specialties: specialties
        .filter((s) => [s.name, s.tagline, ...s.conditions].join(" ").toLowerCase().includes(q))
        .slice(0, 4),
      medicines: medicines
        .filter((m) => [m.name, m.brand, ...m.tags].join(" ").toLowerCase().includes(q))
        .slice(0, 5),
      articles: blogPosts
        .filter((p) => [p.title, p.excerpt, p.category].join(" ").toLowerCase().includes(q))
        .slice(0, 4),
    };
  }, [query]);

  const total = results
    ? results.doctors.length + results.specialties.length + results.medicines.length + results.articles.length
    : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <Search size={20} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search doctors, specialties, medicines and articles"
          aria-label="Search everything"
          autoFocus
          className="h-15 w-full rounded-full border hairline bg-white pr-5 pl-13 text-base text-ink shadow-soft placeholder:text-ink-faint focus:border-electric focus:outline-none"
        />
      </div>

      {!results && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-ink-soft">Try searching for</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-chip bg-white px-3.5 py-2 text-sm font-semibold text-ink-soft shadow-soft transition-colors hover:bg-electric hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {results && total === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={<Search size={22} />}
            title={`Nothing found for "${query}"`}
            body="Try a condition, a doctor's name, a brand, or a department."
          />
        </div>
      )}

      {results && total > 0 && (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-ink-soft" role="status" aria-live="polite">
            <span className="font-semibold text-ink tnum">{total}</span> results for &ldquo;{query}&rdquo;
          </p>

          {results.doctors.length > 0 && (
            <Group icon={<Stethoscope size={15} />} label="Doctors">
              {results.doctors.map((doctor) => (
                <Row key={doctor.id} href={`/doctors/${doctor.slug}`}>
                  <DoctorAvatar doctor={doctor} size={40} rounded="card" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{doctor.name}</span>
                    <span className="block truncate text-xs text-ink-faint">
                      {doctor.specialty} · {doctor.hospital}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink tnum">
                    {formatFee(doctor.consultationFee)}
                  </span>
                </Row>
              ))}
            </Group>
          )}

          {results.specialties.length > 0 && (
            <Group icon={<Tag size={15} />} label="Specialties">
              {results.specialties.map((specialty) => (
                <Row key={specialty.slug} href={`/specialties/${specialty.slug}`}>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{specialty.name}</span>
                    <span className="block truncate text-xs text-ink-faint">{specialty.tagline}</span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-faint tnum">
                    {specialty.doctorCount} doctors
                  </span>
                </Row>
              ))}
            </Group>
          )}

          {results.medicines.length > 0 && (
            <Group icon={<Pill size={15} />} label="Pharmacy">
              {results.medicines.map((item) => (
                <Row key={item.id} href={`/pharmacy/${item.slug}`}>
                  <ProductVisual item={item} size="sm" className="h-10 w-10 shrink-0 rounded-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{item.name}</span>
                    <span className="block truncate text-xs text-ink-faint">
                      {item.brand} · {item.packSize}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink tnum">
                    {formatFee(item.price)}
                  </span>
                </Row>
              ))}
            </Group>
          )}

          {results.articles.length > 0 && (
            <Group icon={<FileText size={15} />} label="Articles">
              {results.articles.map((post) => (
                <Row key={post.id} href={`/blog/${post.slug}`}>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 font-medium text-ink">{post.title}</span>
                    <span className="block truncate text-xs text-ink-faint">
                      {post.category} · {post.author}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-faint tnum">{post.readingMinutes} min</span>
                </Row>
              ))}
            </Group>
          )}
        </div>
      )}
    </div>
  );
}

function Group({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-ink-soft">
        <span className="text-electric">{icon}</span>
        {label}
      </h2>
      <Card padded={false}>
        <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">{children}</ul>
      </Card>
    </section>
  );
}

function Row({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className={cx("flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-mist")}>
        {children}
      </Link>
    </li>
  );
}
