import type { MedicalRecord, Prescription } from "@/types";

export const prescriptions: Prescription[] = [
  {
    id: "RX-4812",
    patientId: "pt-01",
    doctorSlug: "ananya-rao",
    issuedOn: "12 Nov 2026",
    diagnosis: "Stage 1 hypertension",
    active: true,
    notes: "Reduce added salt. Walk 30 minutes daily. Review blood pressure log in four weeks.",
    items: [
      {
        id: "rxi-1",
        medicine: "Amlodipine",
        strength: "5 mg",
        frequency: "Once daily",
        duration: "90 days",
        instructions: "Take in the morning, with or without food.",
      },
      {
        id: "rxi-2",
        medicine: "Low Dose Aspirin",
        strength: "75 mg",
        frequency: "Once daily",
        duration: "90 days",
        instructions: "Take after dinner.",
      },
    ],
  },
  {
    id: "RX-4655",
    patientId: "pt-01",
    doctorSlug: "priya-deshmukh",
    issuedOn: "28 Oct 2026",
    diagnosis: "Atopic dermatitis, mild flare",
    active: true,
    notes: "Apply moisturiser within three minutes of bathing.",
    items: [
      {
        id: "rxi-3",
        medicine: "Ceramide Moisturiser",
        strength: "—",
        frequency: "Twice daily",
        duration: "Ongoing",
        instructions: "Apply generously to affected areas.",
      },
    ],
  },
  {
    id: "RX-4390",
    patientId: "pt-01",
    doctorSlug: "rahul-banerjee",
    issuedOn: "12 Nov 2026",
    diagnosis: "Viral upper respiratory infection",
    active: false,
    notes: "Course completed.",
    items: [
      {
        id: "rxi-4",
        medicine: "Paracetamol",
        strength: "650 mg",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Only if fever is above 100°F.",
      },
      {
        id: "rxi-5",
        medicine: "Cough Syrup Dry",
        strength: "10 ml",
        frequency: "At night",
        duration: "5 days",
        instructions: "Take 30 minutes before sleeping.",
      },
    ],
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: "rec-01",
    title: "Lipid profile and fasting glucose",
    kind: "Blood test",
    date: "10 Nov 2026",
    orderedBy: "Dr. Ananya Rao",
    sizeKb: 184,
    summary: "Total cholesterol 198 mg/dL. Fasting glucose 94 mg/dL. Both within range.",
  },
  {
    id: "rec-02",
    title: "Complete blood count",
    kind: "CBC report",
    date: "10 Nov 2026",
    orderedBy: "Dr. Rahul Banerjee",
    sizeKb: 142,
    summary: "Haemoglobin 14.2 g/dL. White cell count normal. No abnormality detected.",
  },
  {
    id: "rec-03",
    title: "MRI brain, plain",
    kind: "MRI scan",
    date: "22 Sep 2026",
    orderedBy: "Dr. Vikram Mehta",
    sizeKb: 8640,
    summary: "No acute intracranial abnormality. Reported by consultant radiologist.",
  },
  {
    id: "rec-04",
    title: "Chest X-ray, PA view",
    kind: "X-ray",
    date: "12 Nov 2026",
    orderedBy: "Dr. Rahul Banerjee",
    sizeKb: 2210,
    summary: "Clear lung fields. Normal cardiac silhouette.",
  },
  {
    id: "rec-05",
    title: "Prescription — hypertension",
    kind: "Prescription",
    date: "12 Nov 2026",
    orderedBy: "Dr. Ananya Rao",
    sizeKb: 96,
    summary: "Amlodipine 5 mg once daily, low dose aspirin 75 mg once daily, 90 days.",
  },
];

/** Options offered in the doctor's prescription builder. */
export const frequencyOptions = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Every 6 hours",
  "At night",
  "As needed",
];

export const durationOptions = ["3 days", "5 days", "7 days", "14 days", "30 days", "90 days", "Ongoing"];
