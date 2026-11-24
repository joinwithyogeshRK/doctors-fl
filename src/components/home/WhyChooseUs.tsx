import {
  BadgeCheck,
  CalendarCheck,
  Headphones,
  HeartHandshake,
  Lock,
  MonitorSmartphone,
  Pill,
  Receipt,
  Sparkles,
  Truck,
} from "lucide-react";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Reveal } from "@/components/animations/Reveal";

const reasons = [
  { icon: BadgeCheck, title: "Experienced professionals", body: "Every consultant is credential-checked with their medical council before they see a patient." },
  { icon: HeartHandshake, title: "Personalised treatment", body: "Plans built around your history, your schedule and what you can actually sustain." },
  { icon: Sparkles, title: "Advanced technology", body: "Cath labs, digital imaging and reporting by consultant radiologists, not a queue." },
  { icon: CalendarCheck, title: "Easy appointment booking", body: "Real availability, booked in about a minute, rescheduled without a phone call." },
  { icon: Receipt, title: "Transparent pricing", body: "The fee is on the profile before you book. No surprises at the desk afterwards." },
  { icon: MonitorSmartphone, title: "Digital healthcare", body: "Records, prescriptions and reports in one account that follows you between doctors." },
  { icon: Lock, title: "Secure patient information", body: "Role-based access and a full audit trail on every record in the system." },
  { icon: Headphones, title: "Support when you need it", body: "A support desk from 8 AM to 10 PM, and a 24-hour emergency department." },
  { icon: Pill, title: "Convenient pharmacy", body: "Send a prescription straight to the pharmacy cart from your consultation." },
  { icon: Truck, title: "Home delivery", body: "Express within three hours, or free standard delivery over ₹499." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-mist py-24 lg:py-32">
      <div className="shell">
        <SectionIntro
          title="Why patients stay with us"
          lede="Ten things we hold ourselves to. Most of them are unglamorous, which is rather the point."
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-panel border hairline bg-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] sm:grid-cols-2 lg:grid-cols-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <li key={reason.title} className="group bg-white">
                <Reveal delay={0.02 * (i % 5)} y={14}>
                  <div className="h-full p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--color-electric)_9%,white)] text-electric transition-transform duration-300 group-hover:scale-110">
                      <Icon size={19} />
                    </span>
                    <h3 className="mt-4 text-[0.9375rem] font-semibold text-ink">{reason.title}</h3>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">{reason.body}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
