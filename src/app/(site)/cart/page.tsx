import type { Metadata } from "next";
import { CartView } from "@/components/pharmacy/CartView";
import { Breadcrumbs } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Pharmacy", href: "/pharmacy" }, { label: "Cart" }]}
        />
        <div className="mt-6">
          <CartView />
        </div>
      </div>
    </div>
  );
}
