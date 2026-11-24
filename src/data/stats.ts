import type { ImpactStat } from "@/types";

export const impactStats: ImpactStat[] = [
  { value: 50000, suffix: "+", label: "Patients cared for", detail: "Across 20 cities since 2016" },
  { value: 500, suffix: "+", label: "Medical professionals", detail: "Verified and credential-checked" },
  { value: 100, suffix: "+", label: "Partner hospitals", detail: "Multi-speciality and standalone clinics" },
  { value: 98, suffix: "%", label: "Patient satisfaction", detail: "Measured after every consultation" },
  { value: 20, suffix: "+", label: "Cities served", detail: "With same-day medicine delivery" },
];

export const trustSignals = [
  { value: "50,000+", label: "patients cared for" },
  { value: "500+", label: "medical professionals" },
  { value: "4.9/5", label: "patient rating" },
];
