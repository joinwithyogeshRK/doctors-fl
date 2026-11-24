import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/layout/SocialIcons";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { EcgLine } from "@/components/animations/EcgLine";
import { specialties } from "@/data/specialties";

const columns = [
  {
    heading: "Care",
    links: [
      { label: "Find a doctor", href: "/doctors" },
      { label: "Book an appointment", href: "/appointments/book" },
      { label: "Video consultation", href: "/consultation/demo" },
      { label: "Pharmacy", href: "/pharmacy" },
      { label: "Health checks", href: "/services" },
    ],
  },
  {
    heading: "Specialties",
    links: specialties.slice(0, 5).map((s) => ({
      label: s.name,
      href: `/specialties/${s.slug}`,
    })),
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "For doctors", href: "/for-doctors" },
      { label: "Contact", href: "/contact" },
      { label: "Health blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#071129] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/3 h-[26rem] w-[26rem] rounded-full bg-electric/16 blur-[120px]" />
        <div className="absolute -right-20 -bottom-28 h-[24rem] w-[24rem] rounded-full bg-violet/16 blur-[120px]" />
      </div>
      <EcgLine
        className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full opacity-25"
        stroke="var(--color-electric-light)"
        speed={6}
      />

      <div className="shell relative pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Meridian Health connects patients with doctors they can trust, and gives practices
              the tools to look after them properly — from first booking to final follow-up.
            </p>

            <div className="mt-8 max-w-sm">
              <p className="text-sm font-semibold text-white">Health notes, once a month</p>
              <p className="mt-1.5 mb-4 text-[0.8125rem] text-white/55">
                Practical guidance from our consultants. No marketing.
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h3 className="text-sm font-semibold text-white">{column.heading}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/55 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h3 className="text-sm font-semibold text-white">Reach us</h3>
              <ul className="mt-4 space-y-3.5 text-sm text-white/55">
                <li>
                  <a
                    href="tel:+918000000000"
                    className="flex items-start gap-2.5 transition-colors hover:text-white"
                  >
                    <Phone size={15} className="mt-0.5 shrink-0" />
                    +91 80 0000 0000
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:care@meridianhealth.demo"
                    className="flex items-start gap-2.5 transition-colors hover:text-white"
                  >
                    <Mail size={15} className="mt-0.5 shrink-0" />
                    care@meridianhealth.demo
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0" />
                  <span>
                    Meridian Health Centre
                    <br />
                    Indiranagar, Bengaluru 560038
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex gap-2">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/14 text-white/65 transition-colors hover:border-white/35 hover:text-white"
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-6">
          <p className="rounded-xl bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-white/50">
            Interactive demonstration. Doctors, hospitals, reviews and availability shown here are
            fictional. Nothing on this site is medical advice. If you are experiencing a medical
            emergency, contact your local emergency service immediately.
          </p>

          <div className="mt-6 flex flex-col gap-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CurrentYear /> Meridian Health. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of use
              </Link>
              <Link href="/for-doctors" className="transition-colors hover:text-white">
                For doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
