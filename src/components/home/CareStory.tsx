import Image from "next/image";
import { ArrowRight, Clock3, FileHeart, UserRoundCheck } from "lucide-react";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

const principles = [
  {
    icon: UserRoundCheck,
    title: "One record, every visit",
    body: "Prescriptions, reports and consultation notes stay together, so the next doctor starts with the full picture.",
  },
  {
    icon: Clock3,
    title: "Time given back",
    body: "Slots are held open for urgent cases, and reminders go out the day before — no waiting-room queue for a number.",
  },
  {
    icon: FileHeart,
    title: "Care that continues",
    body: "Follow-ups, repeat medicines and recovery plans are scheduled before a patient leaves the room.",
  },
];

export function CareStory() {
  return (
    <section id="about" className="scroll-mt-24 py-24 lg:py-32">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal y={24}>
          <div className="relative">
            <div
              className="relative overflow-hidden rounded-panel p-8 pt-14 sm:p-10 sm:pt-20"
              style={{
                background:
                  "linear-gradient(165deg, var(--color-ice) 0%, var(--color-lavender) 100%)",
              }}
            >
              <span
                className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-electric/18 blur-3xl"
                aria-hidden="true"
              />
              <Image
                src="/assets/healthcare/about/hospital.png"
                alt="Meridian Health hospital building"
                width={919}
                height={419}
                sizes="(max-width: 1024px) 90vw, 36rem"
                className="relative h-auto w-full drop-shadow-[0_28px_44px_rgb(10_26_60/0.2)]"
              />
            </div>

            {/* Floating object + metric, overlapping the panel edges */}
            <Image
              src="/assets/healthcare/about/stethoscope.png"
              alt=""
              width={900}
              height={898}
              sizes="10rem"
              className="pointer-events-none absolute -top-8 -right-4 w-28 rotate-6 drop-shadow-[0_18px_30px_rgb(10_26_60/0.22)] sm:-right-8 sm:w-36"
            />
            <div className="glass absolute -bottom-6 left-6 rounded-card px-5 py-4 sm:left-10">
              <p className="font-display text-2xl font-bold text-ink">12 min</p>
              <p className="mt-0.5 text-xs text-ink-soft">average wait, in clinic</p>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionIntro
            title="A hospital that runs on fewer forms and more attention"
            lede="Meridian Health was built with clinicians, not around them. The result is a practice where the administration disappears into the background."
          />

          <ul className="mt-10 space-y-7">
            {principles.map((principle, i) => {
              const Icon = principle.icon;
              return (
                <Reveal key={principle.title} delay={0.06 * i} y={16}>
                  <li className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--color-electric)_10%,white)] text-electric">
                      <Icon size={19} />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem] font-semibold text-ink">{principle.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {principle.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.2} className="mt-10">
            <ButtonLink href="/about" variant="secondary">
              Read our story
              <ArrowRight size={16} />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
