import { PortalShell } from "@/components/dashboard/PortalShell";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="doctor">{children}</PortalShell>;
}
