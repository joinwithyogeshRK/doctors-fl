import type { Metadata } from "next";
import { NotificationsCentre } from "@/components/marketing/NotificationsCentre";
import { Breadcrumbs } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Notifications" }]} />
        </div>
        <div className="mt-6">
          <NotificationsCentre />
        </div>
      </div>
    </div>
  );
}
