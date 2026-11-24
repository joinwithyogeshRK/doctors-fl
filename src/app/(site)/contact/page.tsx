import type { Metadata } from "next";
import { Ambulance, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";
import { Breadcrumbs, Card, CardTitle, PageHeader } from "@/components/ui/Surfaces";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact and support",
  description: "Phone, email, WhatsApp and live chat support, plus our clinic locations.",
};

const channels = [
  { icon: Phone, label: "Call us", value: "+91 80 0000 0000", detail: "8 AM – 10 PM, every day", href: "tel:+918000000000" },
  { icon: Mail, label: "Email", value: "care@meridianhealth.demo", detail: "Replies within one working day", href: "mailto:care@meridianhealth.demo" },
  { icon: MessageCircle, label: "WhatsApp", value: "+91 80 0000 0001", detail: "For appointment changes", href: "https://wa.me/918000000001" },
];

export default function ContactPage() {
  return (
    <div className="pt-18">
      <section className="border-b hairline bg-[linear-gradient(180deg,var(--color-ice),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <div className="mt-6">
            <PageHeader
              title="Contact and support"
              lede="Call, write, or use the chat bubble in the corner — whichever suits. For anything clinical, book a consultation instead."
            />
          </div>
        </div>
      </section>

      {/* Emergency — deliberately different from everything else */}
      <section className="shell -mt-px py-8">
        <div className="overflow-hidden rounded-panel border-2 border-[color-mix(in_oklab,var(--color-coral)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-coral)_5%,white)]">
          <div className="flex flex-wrap items-center gap-6 p-6 sm:p-8">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-coral text-white">
              <Siren size={26} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-bold text-ink">Medical emergency?</h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
                If you are experiencing a medical emergency, contact your local emergency service
                immediately. This website is not a substitute for emergency medical care, and
                nothing here is monitored in real time.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="tel:112"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                <Phone size={16} />
                Call 112
              </a>
              <a
                href="tel:102"
                className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-coral px-6 text-sm font-bold text-coral transition-colors hover:bg-coral hover:text-white"
              >
                <Ambulance size={16} />
                Ambulance 102
              </a>
            </div>
          </div>
          <p className="border-t border-[color-mix(in_oklab,var(--color-coral)_20%,transparent)] bg-white/50 px-6 py-3 text-xs text-ink-soft sm:px-8">
            Emergency department: Meridian Health Centre, Indiranagar, Bengaluru — open 24 hours.
            These numbers are shown for demonstration; this site places no calls on your behalf.
          </p>
        </div>
      </section>

      <section className="shell py-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
          <ContactForm />

          <div className="space-y-5">
            <Card>
              <CardTitle>Ways to reach us</CardTitle>
              <ul className="space-y-2.5">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <li key={channel.label}>
                      <a
                        href={channel.href}
                        className="flex items-center gap-3.5 rounded-card border hairline p-4 transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-electric)_10%,white)] text-electric">
                          <Icon size={19} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-ink-faint">{channel.label}</span>
                          <span className="block truncate font-semibold text-ink">{channel.value}</span>
                          <span className="block truncate text-xs text-ink-faint">{channel.detail}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
                Prefer to type? The chat bubble in the bottom corner opens a support conversation.
              </p>
            </Card>

            <Card padded={false} className="overflow-hidden">
              <div className="relative h-44 bg-[linear-gradient(160deg,#e8effd,#f1ecfd)]">
                <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <pattern id="contact-streets" width="44" height="44" patternUnits="userSpaceOnUse">
                      <path d="M44 0H0V44" fill="none" stroke="rgb(27 99 255 / 0.1)" strokeWidth="1.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#contact-streets)" />
                </svg>
                <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-electric text-white shadow-lift">
                  <MapPin size={18} />
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-base font-semibold text-ink">Meridian Health Centre</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  12th Main, Indiranagar
                  <br />
                  Bengaluru 560038
                  <br />
                  Karnataka, India
                </p>
                <p className="mt-3 text-xs text-ink-faint">
                  Outpatient 8 AM – 8 PM · Emergency 24 hours
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
