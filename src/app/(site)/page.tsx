import { Hero } from "@/components/home/Hero";
import { QuickAccess } from "@/components/home/QuickAccess";
import { Specialties } from "@/components/home/Specialties";
import { DoctorShowcase } from "@/components/home/DoctorShowcase";
import { CareStory } from "@/components/home/CareStory";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ImpactBand } from "@/components/home/ImpactBand";
import { Testimonials } from "@/components/home/Testimonials";
import { HomeFaq } from "@/components/home/HomeFaq";
import { EmergencyBand } from "@/components/home/EmergencyBand";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickAccess />
      <Specialties />
      <DoctorShowcase />
      <CareStory />
      <WhyChooseUs />
      <ImpactBand />
      <Testimonials />
      <HomeFaq />
      <EmergencyBand />
      <FinalCta />
    </>
  );
}
