import {
  Activity,
  BarChart3,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  CreditCard,
  FileHeart,
  FileText,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  Package,
  Pill,
  Settings,
  ShoppingBag,
  Star,
  Stethoscope,
  UserRound,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DemoRole } from "@/types";

export interface PortalLink {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shown in the mobile bottom bar. */
  primary?: boolean;
}

export const portalNav: Record<DemoRole, PortalLink[]> = {
  patient: [
    { label: "Overview", href: "/patient/dashboard", icon: LayoutDashboard, primary: true },
    { label: "My appointments", href: "/patient/appointments", icon: CalendarDays, primary: true },
    { label: "My doctors", href: "/patient/doctors", icon: Stethoscope },
    { label: "Medical records", href: "/patient/medical-records", icon: FileHeart, primary: true },
    { label: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
    { label: "Medicine orders", href: "/patient/orders", icon: Package, primary: true },
    { label: "Payments", href: "/patient/payments", icon: CreditCard },
    { label: "Health profile", href: "/patient/profile", icon: HeartPulse },
    { label: "Settings", href: "/patient/settings", icon: Settings },
  ],
  doctor: [
    { label: "Overview", href: "/doctor/dashboard", icon: LayoutDashboard, primary: true },
    { label: "Appointments", href: "/doctor/appointments", icon: CalendarDays, primary: true },
    { label: "Patients", href: "/doctor/patients", icon: Users, primary: true },
    { label: "Schedule", href: "/doctor/schedule", icon: CalendarRange },
    { label: "Consultations", href: "/doctor/consultations", icon: Video },
    { label: "Prescriptions", href: "/doctor/prescriptions", icon: ClipboardList, primary: true },
    { label: "Reviews", href: "/doctor/reviews", icon: Star },
    { label: "Analytics", href: "/doctor/analytics", icon: BarChart3 },
    { label: "Settings", href: "/doctor/settings", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard", icon: Gauge, primary: true },
    { label: "Doctors", href: "/admin/doctors", icon: Stethoscope, primary: true },
    { label: "Patients", href: "/admin/patients", icon: UserRound },
    { label: "Appointments", href: "/admin/appointments", icon: CalendarDays, primary: true },
    { label: "Pharmacy", href: "/admin/pharmacy", icon: ShoppingBag, primary: true },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Content", href: "/admin/content", icon: FileText },
    { label: "Analytics", href: "/admin/analytics", icon: Activity },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

export const roleLabel: Record<DemoRole, string> = {
  patient: "Patient portal",
  doctor: "Doctor portal",
  admin: "Admin console",
};
