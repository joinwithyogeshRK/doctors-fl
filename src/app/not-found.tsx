import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { label: "Find a doctor", href: "/doctors" },
  { label: "Specialties", href: "/specialties" },
  { label: "Book an appointment", href: "/appointments/book" },
  { label: "Pharmacy", href: "/pharmacy" },
  { label: "Health blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-16">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(176deg,#ffffff,var(--color-ice)_60%,var(--color-lavender))]" />
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-electric/12 blur-[110px]" />
        <div className="absolute -top-10 right-[-8%] h-[26rem] w-[26rem] rounded-full bg-violet/14 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg text-center">
        <div className="flex justify-center">
          <Logo />
        </div>

        <span className="mx-auto mt-10 grid h-14 w-14 place-items-center rounded-2xl bg-white text-electric shadow-soft">
          <Compass size={26} />
        </span>

        <p className="mt-6 font-display text-sm font-semibold text-electric">404</p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-tight font-bold text-ink">
          We couldn&rsquo;t find that page
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-ink-soft">
          The link may be out of date, or the page may not exist. Here&rsquo;s where most people
          are heading.
        </p>

        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex rounded-chip border border-white bg-white/70 px-3.5 py-2 text-sm font-medium text-ink-soft shadow-soft backdrop-blur-sm transition-colors hover:text-electric"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <ButtonLink href="/" className="mt-9">
          <ArrowLeft size={16} />
          Back to the homepage
        </ButtonLink>
      </div>
    </main>
  );
}
