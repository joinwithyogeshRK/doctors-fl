import Link from "next/link";
import { faqs } from "@/data/faq";
import { Faq } from "@/components/marketing/Faq";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Reveal } from "@/components/animations/Reveal";

export function HomeFaq() {
  return (
    <section className="py-24 lg:py-32">
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionIntro
            title="Questions patients ask us"
            lede="If yours isn't here, the support desk answers from 8 AM to 10 PM every day."
          />
          <Reveal delay={0.1} className="mt-7">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-electric hover:underline"
            >
              Read all frequently asked questions
            </Link>
          </Reveal>
        </div>

        <Reveal y={20}>
          <Faq items={faqs.slice(0, 6)} />
        </Reveal>
      </div>
    </section>
  );
}
