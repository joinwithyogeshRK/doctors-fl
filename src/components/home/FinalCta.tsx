import Image from "next/image";
import { ArrowRight, PhoneCall } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function FinalCta() {
  return (
    <section className="pb-24 lg:pb-32">
      <div className="shell">
        <Reveal y={24}>
          <div className="relative overflow-hidden rounded-panel bg-[linear-gradient(118deg,var(--color-electric)_0%,var(--color-indigo)_52%,var(--color-violet)_100%)] px-7 py-12 text-white sm:px-12 sm:py-16">
            <span
              className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-white/18 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <h2 className="max-w-xl font-display text-[clamp(1.875rem,4.4vw,3rem)] leading-[1.05] font-bold">
                  Booking your next appointment takes about a minute
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
                  Choose a doctor, pick a slot that suits you, and pay at the clinic or online.
                  Reschedule any time without a phone call.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink
                    href="/appointments/book"
                    size="lg"
                    className="bg-white !text-electric shadow-[0_12px_30px_-12px_rgb(0_0_0/0.4)] hover:!text-electric-dark"
                  >
                    Book an appointment
                    <ArrowRight size={17} />
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="onDark" size="lg">
                    <PhoneCall size={16} />
                    Talk to our team
                  </ButtonLink>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <Image
                  src="/assets/healthcare/appointment/calendar.png"
                  alt=""
                  width={840}
                  height={900}
                  sizes="18rem"
                  className="mx-auto w-56 rotate-[-6deg] drop-shadow-[0_30px_50px_rgb(10_26_60/0.35)] xl:w-64"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
