import { PortalShell } from "@/components/dashboard/PortalShell";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="patient">{children}</PortalShell>;
}
