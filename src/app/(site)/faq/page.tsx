import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { faqs } from "@/data/faq";
import { Faq } from "@/components/marketing/Faq";
import { Breadcrumbs, Card, PageHeader } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Answers on booking, cancellations, payments, prescriptions and medicine delivery.",
};

export default function FaqPage() {
  return (
    <div className="pt-18">
      <section className="border-b hairline bg-[linear-gradient(180deg,var(--color-lavender),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          <div className="mt-6">
            <PageHeader
              title="Frequently asked questions"
              lede="The things patients ask us most, answered plainly."
            />
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          <Faq items={faqs} />

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <h2 className="text-base font-semibold text-ink">Still stuck?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Our support desk answers anything the list above doesn&rsquo;t cover, from 8 AM to
                10 PM every day.
              </p>
              <div className="mt-5 space-y-2">
                <a
                  href="tel:+918000000000"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border hairline bg-white text-sm font-semibold text-ink transition-colors hover:border-electric hover:text-electric"
                >
                  <Phone size={15} />
                  +91 80 0000 0000
                </a>
                <ButtonLink href="/contact" className="w-full">
                  <MessageCircle size={16} />
                  Message support
                </ButtonLink>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
