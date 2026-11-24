import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/pharmacy/CheckoutFlow";
import { Breadcrumbs, PageHeader } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
        />
        <div className="mt-6 mb-8">
          <PageHeader title="Checkout" lede="Address, delivery and payment — six quick steps." />
        </div>
        <CheckoutFlow />
      </div>
    </div>
  );
}
