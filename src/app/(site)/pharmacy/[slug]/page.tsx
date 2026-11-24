import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { medicineBySlug, medicines } from "@/data/medicines";
import { ProductDetail } from "@/components/pharmacy/ProductDetail";
import { Breadcrumbs, Skeleton } from "@/components/ui/Surfaces";
import { medicineCategories } from "@/data/medicines";

export function generateStaticParams() {
  return medicines.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = medicineBySlug[slug];
  if (!item) return { title: "Product" };
  return { title: item.name, description: item.description };
}

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = medicineBySlug[slug];
  if (!item) notFound();

  const category = medicineCategories.find((c) => c.slug === item.category);

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: item.store === "wellness" ? "Wellness" : "Pharmacy", href: item.store === "wellness" ? "/wellness" : "/pharmacy" },
          { label: category?.name ?? "Products", href: `/pharmacy?category=${item.category}` },
          { label: item.name },
        ]}
      />
      <div className="mt-8">
        <ProductDetail item={item} />
      </div>
    </>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Suspense fallback={<Skeleton className="h-[30rem] w-full rounded-panel" />}>
          <Detail params={params} />
        </Suspense>
      </div>
    </div>
  );
}
