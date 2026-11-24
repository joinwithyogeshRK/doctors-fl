import type { Metadata } from "next";
import { OrdersView } from "@/components/dashboard/patient/OrdersView";
import { Breadcrumbs } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Your orders" };

export default function OrdersPage() {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Orders" }]} />
        <div className="mt-6">
          <OrdersView />
        </div>
      </div>
    </div>
  );
}
