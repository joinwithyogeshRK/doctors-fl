import { PortalShell } from "@/components/dashboard/PortalShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="admin">{children}</PortalShell>;
}
