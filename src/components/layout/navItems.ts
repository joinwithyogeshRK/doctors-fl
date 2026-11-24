import { specialties } from "@/data/specialties";

export interface NavItem {
  label: string;
  href: string;
  /** Home-page section this item highlights against. */
  sectionId?: string;
  children?: { label: string; href: string; hint?: string }[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/", sectionId: "top" },
  { label: "Doctors", href: "/doctors", sectionId: "doctors" },
  {
    label: "Specialties",
    href: "/specialties",
    sectionId: "specialties",
    children: specialties.map((s) => ({
      label: s.name,
      href: `/specialties/${s.slug}`,
      hint: `${s.doctorCount} doctors`,
    })),
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Book an appointment", href: "/appointments/book", hint: "In clinic or online" },
      { label: "Video consultation", href: "/consultation/demo", hint: "Speak to a doctor today" },
      { label: "Order medicines", href: "/pharmacy", hint: "Delivered to your door" },
      { label: "Health checks", href: "/services", hint: "Annual and preventive" },
    ],
  },
  { label: "Pharmacy", href: "/pharmacy" },
  { label: "About", href: "/about", sectionId: "about" },
  { label: "Contact", href: "/contact" },
];

export const homeSectionIds = ["top", "specialties", "doctors", "about"];
