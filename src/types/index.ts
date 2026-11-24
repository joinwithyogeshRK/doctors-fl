export type ConsultationType = "in-clinic" | "video" | "phone";

export type SpecialtySlug =
  | "cardiology"
  | "neurology"
  | "orthopedics"
  | "pediatrics"
  | "dermatology"
  | "dentistry"
  | "general-medicine"
  | "gynecology"
  | "ophthalmology"
  | "ent"
  | "psychiatry"
  | "gastroenterology";

export interface Specialty {
  slug: SpecialtySlug;
  name: string;
  tagline: string;
  description: string;
  doctorCount: number;
  slotsToday: number;
  /** Tailwind token name -> var(--color-sp-*) */
  accent: string;
  conditions: string[];
}

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  specialtySlug: SpecialtySlug;
  qualifications: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  hospital: string;
  location: string;
  languages: string[];
  profileImage: string | null;
  availableToday: boolean;
  online: boolean;
  nextSlot: string;
  consultationTypes: ConsultationType[];
  availableSlots: string[];
  bio: string;
  expertise: string[];
  gender: "female" | "male";
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientCity: string;
  doctorName: string;
  specialty: string;
  rating: number;
  consultationType: ConsultationType;
  quote: string;
  date: string;
}

export interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
  detail: string;
}

/* ---------- Pharmacy & store ---------- */

export type MedicineCategory =
  | "pain-relief"
  | "cold-and-flu"
  | "vitamins"
  | "diabetes-care"
  | "heart-health"
  | "skin-care"
  | "baby-care"
  | "first-aid"
  | "devices";

export interface Medicine {
  id: string;
  slug: string;
  name: string;
  brand: string;
  strength: string;
  packSize: string;
  category: MedicineCategory;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  prescriptionRequired: boolean;
  /** Wellness store items sit in the devices/supplement aisles. */
  store: "pharmacy" | "wellness";
  description: string;
  ingredients: string[];
  manufacturer: string;
  dosageNote: string;
  tags: string[];
}

export interface CartLine {
  id: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  label: string;
  percent: number;
  maxDiscount: number;
  minSpend: number;
}

export interface Address {
  id: string;
  label: "Home" | "Office" | "Other";
  name: string;
  line1: string;
  landmark: string;
  city: string;
  pincode: string;
  phone: string;
}

export type DeliverySpeed = "standard" | "express" | "scheduled";

export type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking"
  | "wallet"
  | "cod"
  | "pay-at-clinic";

export type OrderStage =
  | "placed"
  | "confirmed"
  | "preparing"
  | "verified"
  | "packed"
  | "out-for-delivery"
  | "delivered";

export interface Order {
  id: string;
  placedAt: string;
  stage: OrderStage;
  items: { medicineId: string; quantity: number }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  address: Address;
  speed: DeliverySpeed;
  payment: PaymentMethod;
  paid: boolean;
  rider: { name: string; vehicle: string; phone: string };
  eta: string;
}

/* ---------- Appointments & clinical ---------- */

export type AppointmentStatus =
  | "upcoming"
  | "pending"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  doctorSlug: string;
  patientId: string;
  date: string;
  time: string;
  type: ConsultationType;
  status: AppointmentStatus;
  reason: string;
  fee: number;
  paid: boolean;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "female" | "male" | "other";
  phone: string;
  email: string;
  bloodGroup: string;
  city: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  emergencyContact: { name: string; relation: string; phone: string };
  lastVisit: string;
}

export interface PrescriptionItem {
  id: string;
  medicine: string;
  strength: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorSlug: string;
  issuedOn: string;
  diagnosis: string;
  items: PrescriptionItem[];
  notes: string;
  active: boolean;
}

export interface MedicalRecord {
  id: string;
  title: string;
  kind: "Blood test" | "CBC report" | "MRI scan" | "X-ray" | "Prescription";
  date: string;
  orderedBy: string;
  sizeKb: number;
  summary: string;
}

/* ---------- Platform ---------- */

export type NotificationKind =
  | "appointment"
  | "order"
  | "prescription"
  | "payment";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readingMinutes: number;
  featured: boolean;
  body: string[];
}

export type DemoRole = "patient" | "doctor" | "admin";
