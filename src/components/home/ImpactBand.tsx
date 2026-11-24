import { impactStats } from "@/data/stats";
import { CountUp } from "@/components/animations/CountUp";
import { EcgLine } from "@/components/animations/EcgLine";
import { Reveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const [lead, ...supporting] = impactStats;

/**
 * The one dark passage in the page. Deliberately not a card grid: a single
 * dominant figure with the rest set as a measured column beside it.
 */
export function ImpactBand() {
  return (
    <section className="relative overflow-hidden bg-[#0a1733] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-[12%] h-[30rem] w-[30rem] rounded-full bg-electric/22 blur-[120px]" />
        <div className="absolute -right-24 bottom-[-20%] h-[28rem] w-[28rem] rounded-full bg-violet/22 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.16) 1px, transparent 0)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(70% 60% at 50% 40%, black, transparent)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <EcgLine
        className="pointer-events-none absolute inset-x-0 top-1/2 h-32 w-full -translate-y-1/2 opacity-30"
        stroke="var(--color-electric-light)"
        speed={5}
      />

      <div className="shell relative grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="text-sm font-medium text-electric-light">Since 2016</p>
          <p className="mt-4 font-display text-[clamp(4rem,11vw,7.5rem)] leading-[0.86] font-bold tracking-tighter">
            <CountUp value={lead.value} suffix={lead.suffix} />
          </p>
          <h2 className="mt-5 font-display text-2xl font-semibold sm:text-3xl">{lead.label}</h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-white/65">
            {lead.detail}. Each of them with a record they own, a doctor they chose, and care that
            did not stop at the hospital door.
          </p>
          <ButtonLink href="/about" variant="onDark" className="mt-8">
            How we measure this
            <ArrowRight size={16} />
          </ButtonLink>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="divide-y divide-white/12 border-y border-white/12">
            {supporting.map((stat) => (
              <div
                key={stat.label}
                className="group flex items-baseline gap-6 py-6 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <dd className="font-display w-28 shrink-0 text-[2.25rem] leading-none font-bold text-white sm:w-32 sm:text-[2.75rem]">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
                <div className="min-w-0">
                  <dt className="text-base font-semibold text-white">{stat.label}</dt>
                  <dd className="mt-1 text-sm text-white/55">{stat.detail}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
