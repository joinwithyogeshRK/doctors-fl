import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { doctorBySlug, doctors } from "@/data/doctors";
import { doctorProfile } from "@/data/doctorProfiles";
import { DoctorProfileView } from "@/components/doctors/DoctorProfileView";
import { Breadcrumbs, SkeletonCard } from "@/components/ui/Surfaces";

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctorBySlug[slug];
  if (!doctor) return { title: "Doctor" };
  return {
    title: `${doctor.name} — ${doctor.specialty}`,
    description: doctor.bio,
  };
}

async function Profile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = doctorBySlug[slug];
  if (!doctor) notFound();

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name },
        ]}
      />
      <div className="mt-6">
        <DoctorProfileView doctor={doctor} profile={doctorProfile(doctor)} />
      </div>
    </>
  );
}

export default function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Suspense fallback={<SkeletonCard />}>
          <Profile params={params} />
        </Suspense>
      </div>
    </div>
  );
}
