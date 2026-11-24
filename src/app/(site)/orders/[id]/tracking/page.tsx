import { Suspense } from "react";
import type { Metadata } from "next";
import { orders } from "@/data/orders";
import { OrderTracking } from "@/components/pharmacy/OrderTracking";
import { Breadcrumbs, PageHeader, Skeleton } from "@/components/ui/Surfaces";

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }));
}

export const metadata: Metadata = { title: "Track your order" };

async function Tracking({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: id },
        ]}
      />
      <div className="mt-6 mb-8">
        <PageHeader title="Track your order" lede="Every step from the pharmacy shelf to your door." />
      </div>
      <OrderTracking orderId={id} />
    </>
  );
}

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-panel" />}>
          <Tracking params={params} />
        </Suspense>
      </div>
    </div>
  );
}
