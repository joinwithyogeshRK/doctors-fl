"use client";

import Link from "next/link";
import { doctorBySlug, doctors } from "@/data/doctors";
import { patients } from "@/data/patients";
import { medicines, discountPercent } from "@/data/medicines";
import { doctorAppointments } from "@/data/appointments";
import { blogPosts } from "@/data/blog";
import { doctorProfile } from "@/data/doctorProfiles";
import { patientById } from "@/data/patients";
import { consultationLabel, formatFee } from "@/lib/format";
import { formatLongDate } from "@/hooks/useToday";
import { ManagementTable } from "@/components/dashboard/admin/ManagementTable";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";
import { StatusPill } from "@/components/ui/Surfaces";
import { Stars } from "@/components/ui/Stars";
import { ButtonLink } from "@/components/ui/Button";

/* ---------------- Patients ---------------- */

export function AdminPatients() {
  return (
    <ManagementTable
      title="Patients"
      lede="Registered patients, their contact details and last visit."
      rows={patients}
      searchKeys={(p) => [p.name, p.city, p.email, ...p.conditions].join(" ")}
      filters={[
        { label: "Has allergies", test: (p) => p.allergies.length > 0 },
        { label: "Ongoing conditions", test: (p) => p.conditions.length > 0 },
      ]}
      emptyTitle="No patients match"
      emptyBody="Try a different name, city or condition."
      columns={[
        {
          key: "name",
          header: "Patient",
          render: (p) => (
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-[0.625rem] font-bold text-white">
                {p.name.split(" ").map((x) => x[0]).join("")}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{p.name}</p>
                <p className="truncate text-xs text-ink-faint">
                  {p.age}, {p.gender}
                </p>
              </div>
            </div>
          ),
        },
        { key: "city", header: "City", hideBelow: "sm", render: (p) => <span className="text-ink-soft">{p.city}</span> },
        {
          key: "contact",
          header: "Contact",
          hideBelow: "lg",
          render: (p) => (
            <span className="text-ink-soft">
              {p.phone}
              <span className="block text-xs text-ink-faint">{p.email}</span>
            </span>
          ),
        },
        { key: "blood", header: "Blood", hideBelow: "md", render: (p) => <span className="font-medium text-ink">{p.bloodGroup}</span> },
        {
          key: "conditions",
          header: "Conditions",
          hideBelow: "lg",
          render: (p) => (
            <span className="text-xs text-ink-soft">{p.conditions.join(", ") || "None"}</span>
          ),
        },
        { key: "visit", header: "Last visit", align: "right", render: (p) => <span className="text-ink-soft">{p.lastVisit}</span> },
      ]}
    />
  );
}

/* ---------------- Appointments ---------------- */

export function AdminAppointments() {
  return (
    <ManagementTable
      title="Appointments"
      lede="Bookings across every clinic, with payment and consultation status."
      rows={doctorAppointments}
      searchKeys={(a) =>
        [a.id, a.reason, doctorBySlug[a.doctorSlug]?.name ?? "", patientById[a.patientId]?.name ?? ""].join(" ")
      }
      filters={[
        { label: "Upcoming", test: (a) => a.status === "upcoming" },
        { label: "Pending", test: (a) => a.status === "pending" },
        { label: "Completed", test: (a) => a.status === "completed" },
        { label: "Unpaid", test: (a) => !a.paid },
      ]}
      emptyTitle="No appointments match"
      emptyBody="Try a different reference, doctor or patient."
      columns={[
        { key: "id", header: "Reference", render: (a) => <span className="font-medium text-ink tnum">{a.id}</span> },
        {
          key: "patient",
          header: "Patient",
          render: (a) => <span className="text-ink-soft">{patientById[a.patientId]?.name}</span>,
        },
        {
          key: "doctor",
          header: "Doctor",
          hideBelow: "md",
          render: (a) => (
            <Link href={`/doctors/${a.doctorSlug}`} className="text-ink-soft hover:text-electric hover:underline">
              {doctorBySlug[a.doctorSlug]?.name}
            </Link>
          ),
        },
        {
          key: "when",
          header: "When",
          hideBelow: "lg",
          render: (a) => (
            <span className="text-ink-soft">
              {formatLongDate(a.date)}
              <span className="block text-xs text-ink-faint tnum">{a.time}</span>
            </span>
          ),
        },
        { key: "type", header: "Type", hideBelow: "sm", render: (a) => <span className="text-ink-soft">{consultationLabel[a.type]}</span> },
        { key: "status", header: "Status", render: (a) => <StatusPill status={a.status} /> },
        {
          key: "payment",
          header: "Payment",
          align: "right",
          render: (a) => (
            <StatusPill status={a.paid ? "paid" : "unpaid"}>
              {a.paid ? formatFee(a.fee) : "Unpaid"}
            </StatusPill>
          ),
        },
      ]}
    />
  );
}

/* ---------------- Pharmacy ---------------- */

export function AdminPharmacy() {
  return (
    <ManagementTable
      title="Pharmacy catalogue"
      lede="Stock levels, pricing and prescription requirements across the catalogue."
      action={<ButtonLink href="/pharmacy" variant="secondary">View storefront</ButtonLink>}
      rows={medicines}
      searchKeys={(m) => [m.name, m.brand, m.category, ...m.tags].join(" ")}
      filters={[
        { label: "Out of stock", test: (m) => !m.inStock },
        { label: "Prescription", test: (m) => m.prescriptionRequired },
        { label: "Discounted", test: (m) => discountPercent(m) >= 20 },
        { label: "Wellness", test: (m) => m.store === "wellness" },
      ]}
      emptyTitle="No products match"
      emptyBody="Try a different product, brand or category."
      columns={[
        {
          key: "name",
          header: "Product",
          render: (m) => (
            <div className="flex items-center gap-3">
              <ProductVisual item={m} size="sm" className="h-9 w-9 shrink-0 rounded-lg" />
              <div className="min-w-0">
                <Link href={`/pharmacy/${m.slug}`} className="block truncate font-medium text-ink hover:text-electric hover:underline">
                  {m.name}
                </Link>
                <p className="truncate text-xs text-ink-faint">{m.brand}</p>
              </div>
            </div>
          ),
        },
        {
          key: "category",
          header: "Category",
          hideBelow: "md",
          render: (m) => <span className="text-ink-soft capitalize">{m.category.replace(/-/g, " ")}</span>,
        },
        { key: "pack", header: "Pack", hideBelow: "lg", render: (m) => <span className="text-ink-soft">{m.packSize}</span> },
        {
          key: "price",
          header: "Price",
          align: "right",
          render: (m) => (
            <span className="font-semibold text-ink tnum">
              {formatFee(m.price)}
              {discountPercent(m) > 0 && (
                <span className="block text-xs font-normal text-mint">{discountPercent(m)}% off</span>
              )}
            </span>
          ),
        },
        {
          key: "rx",
          header: "Rx",
          hideBelow: "sm",
          render: (m) =>
            m.prescriptionRequired ? <StatusPill status="pending">Required</StatusPill> : <span className="text-xs text-ink-faint">—</span>,
        },
        {
          key: "stock",
          header: "Stock",
          align: "right",
          render: (m) => (
            <StatusPill status={m.inStock ? "completed" : "cancelled"}>
              {m.inStock ? "In stock" : "Out"}
            </StatusPill>
          ),
        },
      ]}
    />
  );
}

/* ---------------- Reviews ---------------- */

const allReviews = doctors.slice(0, 6).flatMap((doctor) =>
  doctorProfile(doctor).reviews.slice(0, 2).map((review) => ({
    ...review,
    doctorName: doctor.name,
    doctorSlug: doctor.slug,
    specialty: doctor.specialty,
  })),
);

export function AdminReviews() {
  return (
    <ManagementTable
      title="Reviews"
      lede="Patient feedback across the platform, ready for moderation."
      rows={allReviews}
      searchKeys={(r) => [r.name, r.doctorName, r.body, r.specialty].join(" ")}
      filters={[
        { label: "5 stars", test: (r) => r.rating === 5 },
        { label: "Below 5", test: (r) => r.rating < 5 },
      ]}
      emptyTitle="No reviews match"
      emptyBody="Try a different patient, doctor or keyword."
      columns={[
        { key: "name", header: "Patient", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
        {
          key: "doctor",
          header: "Doctor",
          render: (r) => (
            <Link href={`/doctors/${r.doctorSlug}`} className="text-ink-soft hover:text-electric hover:underline">
              {r.doctorName}
              <span className="block text-xs text-ink-faint">{r.specialty}</span>
            </Link>
          ),
        },
        {
          key: "body",
          header: "Review",
          hideBelow: "lg",
          render: (r) => <span className="line-clamp-2 max-w-md text-ink-soft">{r.body}</span>,
        },
        { key: "date", header: "When", hideBelow: "md", render: (r) => <span className="text-ink-faint">{r.date}</span> },
        {
          key: "rating",
          header: "Rating",
          align: "right",
          render: (r) => (
            <span className="inline-flex items-center gap-1.5">
              <Stars rating={r.rating} size={12} />
              <span className="font-medium text-ink tnum">{r.rating}</span>
            </span>
          ),
        },
        { key: "status", header: "Status", align: "right", render: () => <StatusPill status="completed">Published</StatusPill> },
      ]}
    />
  );
}

/* ---------------- Content ---------------- */

export function AdminContent() {
  return (
    <ManagementTable
      title="Website content"
      lede="Articles published on the health blog."
      action={<ButtonLink href="/blog" variant="secondary">View the blog</ButtonLink>}
      rows={blogPosts}
      searchKeys={(p) => [p.title, p.category, p.author, p.excerpt].join(" ")}
      filters={[{ label: "Featured", test: (p) => p.featured }]}
      emptyTitle="No articles match"
      emptyBody="Try a different title, author or category."
      columns={[
        {
          key: "title",
          header: "Article",
          render: (p) => (
            <Link href={`/blog/${p.slug}`} className="block max-w-sm font-medium text-ink hover:text-electric hover:underline">
              <span className="line-clamp-2">{p.title}</span>
            </Link>
          ),
        },
        { key: "category", header: "Category", hideBelow: "sm", render: (p) => <span className="text-ink-soft">{p.category}</span> },
        {
          key: "author",
          header: "Author",
          hideBelow: "md",
          render: (p) => (
            <span className="text-ink-soft">
              {p.author}
              <span className="block text-xs text-ink-faint">{p.authorRole}</span>
            </span>
          ),
        },
        { key: "date", header: "Published", hideBelow: "lg", render: (p) => <span className="text-ink-faint">{p.date}</span> },
        { key: "read", header: "Length", align: "right", render: (p) => <span className="text-ink-soft tnum">{p.readingMinutes} min</span> },
        {
          key: "status",
          header: "Status",
          align: "right",
          render: (p) => <StatusPill status={p.featured ? "upcoming" : "completed"}>{p.featured ? "Featured" : "Live"}</StatusPill>,
        },
      ]}
    />
  );
}
