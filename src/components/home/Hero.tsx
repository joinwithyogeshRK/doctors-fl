"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "@/components/home/HeroVisual";
import { EcgLine } from "@/components/animations/EcgLine";
import { trustSignals } from "@/data/stats";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  // One orchestrated entrance, top to bottom.
  const step = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.08 * i, ease },
  });

  return (
    <section id="top" className="relative overflow-hidden pt-18">
      {/* Layered background: ice wash, two colour glows, a faint grid */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(176deg,#ffffff_0%,var(--color-ice)_46%,var(--color-lavender)_100%)]" />
        <div className="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full bg-electric/14 blur-[110px]" />
        <div className="absolute -top-20 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-violet/16 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(27 99 255 / 0.11) 1px, transparent 0)",
            backgroundSize: "26px 26px",
            maskImage: "linear-gradient(to bottom, black 10%, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 78%)",
          }}
        />
      </div>

      <div className="shell grid items-center gap-10 pt-10 pb-28 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6 lg:pt-14 lg:pb-36">
        <div className="relative z-10 max-w-xl">
          <motion.div {...step(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 py-1.5 pr-4 pl-1.5 text-[0.8125rem] font-medium text-ink-soft shadow-soft backdrop-blur-sm">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-white">
                <ShieldCheck size={13} />
              </span>
              Trusted Healthcare · Designed Around You
            </span>
          </motion.div>

          <motion.h1
            {...step(1)}
            className="mt-6 font-display text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.96] font-bold text-ink"
          >
            Your Health.
            <br />
            <span className="text-gradient">Our Priority.</span>
          </motion.h1>

          <motion.p
            {...step(2)}
            className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft"
          >
            Exceptional doctors, personalised care, and modern healthcare — all designed around
            your life.
          </motion.p>

          <motion.div {...step(3)} className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/appointments/book" size="lg">
              Book an appointment
              <ArrowRight size={17} />
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" size="lg">
              Explore our services
            </ButtonLink>
          </motion.div>

          <motion.dl
            {...step(4)}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t hairline pt-6"
          >
            {trustSignals.map((signal) => (
              <div key={signal.label}>
                <dt className="sr-only">{signal.label}</dt>
                <dd className="font-display text-2xl font-bold text-ink">{signal.value}</dd>
                <dd className="mt-0.5 text-[0.8125rem] text-ink-soft">{signal.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="relative lg:-mr-6"
        >
          <HeroVisual />
        </motion.div>
      </div>

      {/* Heartbeat trace running under the whole hero */}
      <EcgLine
        className="pointer-events-none absolute inset-x-0 bottom-20 -z-10 h-24 w-full opacity-55"
        speed={4.5}
      />
    </section>
  );
}
