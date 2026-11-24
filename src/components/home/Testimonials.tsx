"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useState } from "react";
import { testimonials } from "@/data/testimonials";
import { consultationLabel, cx } from "@/lib/format";
import { Stars } from "@/components/ui/Stars";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ReviewDialog } from "@/components/home/ReviewDialog";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const reduce = useReducedMotion();

  const go = (next: number) => {
    const total = testimonials.length;
    setDirection(next > index ? 1 : -1);
    setIndex(((next % total) + total) % total);
  };

  const current = testimonials[index];

  return (
    <section className="relative overflow-hidden bg-mist py-24 lg:py-32">
      <div className="shell">
        <SectionIntro
          title="What patients say after the visit"
          lede="Collected after every consultation, in the patient's own words."
          action={
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>
              Share your experience
            </Button>
          }
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          {/* The quote itself */}
          <div className="relative min-h-[22rem] sm:min-h-[20rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={current.id}
                custom={direction}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -36 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.14}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) go(index + 1);
                  if (info.offset.x > 70) go(index - 1);
                }}
                className="relative h-full cursor-grab rounded-panel bg-white p-8 shadow-soft active:cursor-grabbing sm:p-10"
              >
                <Quote
                  size={44}
                  strokeWidth={0}
                  className="fill-[color-mix(in_oklab,var(--color-electric)_14%,white)]"
                  aria-hidden="true"
                />
                <blockquote className="mt-4 font-display text-[1.375rem] leading-[1.45] font-medium text-ink sm:text-[1.625rem]">
                  {current.quote}
                </blockquote>

                <figcaption className="mt-8 flex flex-wrap items-center gap-4 border-t hairline pt-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] font-display text-sm font-semibold text-white">
                    {current.patientName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{current.patientName}</span>
                    <span className="block text-[0.8125rem] text-ink-soft">
                      {current.patientCity} · {consultationLabel[current.consultationType]}{" "}
                      consultation with {current.doctorName}
                    </span>
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    <Stars rating={current.rating} size={15} />
                    <span className="text-[0.8125rem] text-ink-faint">{current.date}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls and specialty context */}
          <div className="flex flex-col justify-between gap-8">
            <div className="rounded-panel bg-[linear-gradient(160deg,var(--color-ice),var(--color-lavender))] p-8">
              <p className="font-display text-5xl font-bold text-ink">4.9</p>
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={5} size={16} />
                <span className="text-sm text-ink-soft">average patient rating</span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                Based on {(12480).toLocaleString("en-IN")} reviews left after consultations across
                all twelve specialties.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1.5" role="tablist" aria-label="Choose a review">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Review ${i + 1} of ${testimonials.length}`}
                    onClick={() => go(i)}
                    className={cx(
                      "h-2 rounded-full transition-all duration-300",
                      i === index ? "w-7 bg-electric" : "w-2 bg-ink-faint/40 hover:bg-ink-faint",
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous review"
                  className="grid h-11 w-11 place-items-center rounded-full border hairline bg-white text-ink transition-colors hover:border-electric hover:text-electric"
                >
                  <ArrowLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next review"
                  className="grid h-11 w-11 place-items-center rounded-full border hairline bg-white text-ink transition-colors hover:border-electric hover:text-electric"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </section>
  );
}
