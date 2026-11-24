import { Ambulance, MapPin, Phone, Siren } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Deliberately unlike every other band on the page: a controlled red,
 * square-shouldered, no gradient wash. It should read as an interruption.
 */
export function EmergencyBand() {
  return (
    <section aria-labelledby="emergency-heading" className="pb-24 lg:pb-32">
      <div className="shell">
        <Reveal y={18}>
          <div className="overflow-hidden rounded-panel border-2 border-[color-mix(in_oklab,var(--color-coral)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-coral)_5%,white)]">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-coral px-3.5 py-1.5 text-xs font-bold text-white">
                  <Siren size={13} />
                  Emergency care
                </span>

                <h2
                  id="emergency-heading"
                  className="mt-5 font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight font-bold text-ink"
                >
                  If this is an emergency, don&rsquo;t use this website
                </h2>
                <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-soft">
                  Contact your local emergency service immediately. This website is not a
                  substitute for emergency medical care, is not monitored in real time, and places
                  no calls on your behalf.
                </p>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  <a
                    href="tel:112"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <Phone size={16} />
                    Emergency 112
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

              <div className="rounded-card border border-[color-mix(in_oklab,var(--color-coral)_20%,transparent)] bg-white p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <MapPin size={15} className="text-coral" />
                  Emergency department
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Meridian Health Centre
                  <br />
                  12th Main, Indiranagar
                  <br />
                  Bengaluru 560038
                </p>
                <p className="mt-4 border-t hairline pt-4 text-sm font-semibold text-ink">
                  Open 24 hours, every day
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Resuscitation, trauma and acute cardiac cover on site
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
