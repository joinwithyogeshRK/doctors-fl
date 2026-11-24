import { specialtyBySlug } from "@/data/specialties";
import type { Doctor } from "@/types";

export interface EducationEntry {
  years: string;
  qualification: string;
  institution: string;
}

export interface ExperienceEntry {
  years: string;
  role: string;
  place: string;
}

export interface DoctorReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  type: string;
  body: string;
}

export interface DoctorProfile {
  education: EducationEntry[];
  experience: ExperienceEntry[];
  awards: string[];
  publications: string[];
  conditions: string[];
  procedures: string[];
  reviews: DoctorReview[];
  faqs: { question: string; answer: string }[];
}

const colleges = [
  "Christian Medical College, Vellore",
  "Armed Forces Medical College, Pune",
  "Maulana Azad Medical College, Delhi",
  "Grant Medical College, Mumbai",
  "Kasturba Medical College, Manipal",
  "St. John's Medical College, Bengaluru",
  "Madras Medical College, Chennai",
  "Seth G.S. Medical College, Mumbai",
];

const institutes = [
  "All India Institute of Medical Sciences, New Delhi",
  "Postgraduate Institute of Medical Education and Research, Chandigarh",
  "Sanjay Gandhi Postgraduate Institute, Lucknow",
  "Nizam's Institute of Medical Sciences, Hyderabad",
];

const awardPool = [
  "Young Clinician of the Year, State Medical Association",
  "Best Teaching Faculty, postgraduate programme",
  "Patient Choice Award, three consecutive years",
  "Excellence in Clinical Audit, hospital council",
  "Distinguished Service Medal, district health society",
  "Research Grant, National Medical Council",
];

const procedurePool: Record<string, string[]> = {
  cardiology: ["Echocardiography", "Treadmill stress test", "Coronary angiography", "Holter monitoring"],
  neurology: ["Electroencephalography", "Nerve conduction study", "Botulinum injection", "Lumbar puncture"],
  orthopedics: ["Knee arthroscopy", "Joint injection", "Fracture fixation", "Total joint replacement"],
  pediatrics: ["Growth assessment", "Immunisation", "Nebulisation", "Developmental screening"],
  dermatology: ["Patch testing", "Chemical peel", "Cryotherapy", "Skin biopsy"],
  dentistry: ["Scaling and polishing", "Root canal treatment", "Clear aligner fitting", "Dental implant"],
  "general-medicine": ["Annual health check", "Chronic disease review", "Vaccination", "Minor procedures"],
  gynecology: ["Antenatal ultrasound", "Colposcopy", "IUD insertion", "Hysteroscopy"],
  ophthalmology: ["Phacoemulsification", "Retinal imaging", "Tonometry", "Refraction testing"],
  ent: ["Nasal endoscopy", "Audiometry", "Tonsillectomy", "Myringotomy"],
  psychiatry: ["Cognitive behavioural therapy", "Medication review", "Sleep assessment", "Psychometric testing"],
  gastroenterology: ["Upper GI endoscopy", "Colonoscopy", "Liver elastography", "Capsule endoscopy"],
};

const reviewBodies = [
  "Explained the diagnosis clearly and did not rush the consultation. I left understanding what was happening and what came next.",
  "Listened properly before reaching for the prescription pad. That is rarer than it should be.",
  "Appointment ran on time and the follow-up was already booked before I left the room.",
  "Honest about what the tests could and could not tell us, which I appreciated more than reassurance would have.",
  "Patient with my long list of questions and never made me feel like I was wasting time.",
  "The treatment plan was practical and fitted around my work rather than the other way round.",
  "Took a careful history and spotted something two previous doctors had missed.",
  "Warm manner, clear instructions, and the clinic staff were equally organised.",
];

const reviewNames = [
  "Anil R.", "Sneha M.", "Kiran B.", "Pooja D.", "Vikas S.", "Nisha T.",
  "Gopal V.", "Reena K.", "Suresh N.", "Aarti J.", "Manoj P.", "Divya L.",
];

const reviewDates = ["3 days ago", "1 week ago", "2 weeks ago", "1 month ago", "2 months ago"];

/** Stable pseudo-random index derived from a string, so output never shifts. */
function seed(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100_000;
  }
  return hash;
}

export function doctorProfile(doctor: Doctor): DoctorProfile {
  const s = seed(doctor.slug);
  const pick = <T,>(list: T[], offset: number): T => list[(s + offset) % list.length];

  const graduationYear = 2026 - doctor.experienceYears - 1;
  const specialty = specialtyBySlug[doctor.specialtySlug];

  const education: EducationEntry[] = [
    {
      years: `${graduationYear - 5}–${graduationYear}`,
      qualification: doctor.qualifications[0],
      institution: pick(colleges, 0),
    },
  ];
  if (doctor.qualifications[1]) {
    education.push({
      years: `${graduationYear + 1}–${graduationYear + 4}`,
      qualification: doctor.qualifications[1],
      institution: pick(colleges, 3),
    });
  }
  if (doctor.qualifications[2]) {
    education.push({
      years: `${graduationYear + 5}–${graduationYear + 8}`,
      qualification: doctor.qualifications[2],
      institution: pick(institutes, 1),
    });
  }

  const experience: ExperienceEntry[] = [
    {
      years: `${2026 - Math.max(3, Math.floor(doctor.experienceYears / 2))}–present`,
      role: `Consultant, ${doctor.specialty}`,
      place: doctor.hospital,
    },
    {
      years: `${graduationYear + 4}–${2026 - Math.max(3, Math.floor(doctor.experienceYears / 2))}`,
      role: `Registrar, ${doctor.specialty}`,
      place: pick(institutes, 2),
    },
  ];

  const reviews: DoctorReview[] = Array.from({ length: 4 }).map((_, i) => ({
    id: `${doctor.slug}-rv-${i}`,
    name: pick(reviewNames, i * 3),
    rating: i === 3 && doctor.rating < 4.8 ? 4 : 5,
    date: pick(reviewDates, i * 2),
    type: doctor.consultationTypes[i % doctor.consultationTypes.length] === "video" ? "Video" : "In clinic",
    body: pick(reviewBodies, i * 5),
  }));

  return {
    education,
    experience,
    awards: [pick(awardPool, 0), pick(awardPool, 4)],
    publications: [
      `Outcomes in ${doctor.expertise[0].toLowerCase()}: a five-year single-centre review`,
      `Practical approaches to ${doctor.expertise[1]?.toLowerCase() ?? doctor.specialty.toLowerCase()} in routine practice`,
    ],
    conditions: Array.from(new Set([...(specialty?.conditions ?? []), ...doctor.expertise])),
    procedures: procedurePool[doctor.specialtySlug] ?? procedurePool["general-medicine"],
    reviews,
    faqs: [
      {
        question: `What does a consultation with ${doctor.name} cost?`,
        answer: `A consultation is ₹${doctor.consultationFee.toLocaleString("en-IN")}. Follow-ups within 14 days of a visit are not charged again.`,
      },
      {
        question: "How do I get a video consultation?",
        answer: doctor.consultationTypes.includes("video")
          ? "Choose Video when booking. You will get a link that opens in your browser — no app to install — and a reminder 15 minutes before."
          : "This doctor currently sees patients in clinic only. Several colleagues in the same department offer video consultations.",
      },
      {
        question: "Which languages can I be seen in?",
        answer: `${doctor.languages.slice(0, -1).join(", ")} and ${doctor.languages[doctor.languages.length - 1]}.`,
      },
      {
        question: "Can I reschedule or cancel?",
        answer:
          "Yes, free of charge up to four hours before the appointment, from your appointments page. Later than that, the fee is held as credit for 30 days.",
      },
      {
        question: "Will I get a written prescription?",
        answer:
          "Every consultation produces a digital prescription in your account, which you can download or send straight to the pharmacy.",
      },
    ],
  };
}
