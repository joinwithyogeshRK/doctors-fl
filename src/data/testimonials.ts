import type { Testimonial } from "@/types";

/** Fictional patients, written for demonstration. */
export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    patientName: "Shruti Kulkarni",
    patientCity: "Pune",
    doctorName: "Dr. Priya Deshmukh",
    specialty: "Dermatology",
    rating: 5,
    consultationType: "video",
    quote:
      "I had put off seeing someone about my skin for two years. The video consultation took fifteen minutes, the prescription was in my account before the call ended, and the follow-up was already booked.",
    date: "2 weeks ago",
  },
  {
    id: "t-02",
    patientName: "Rohit Varma",
    patientCity: "Bengaluru",
    doctorName: "Dr. Ananya Rao",
    specialty: "Cardiology",
    rating: 5,
    consultationType: "in-clinic",
    quote:
      "My father's angioplasty follow-ups used to mean a full day off work. Now I can see every report, every medicine and the next appointment on one screen, and he gets a reminder call the day before.",
    date: "1 month ago",
  },
  {
    id: "t-03",
    patientName: "Fatima Ansari",
    patientCity: "Hyderabad",
    doctorName: "Dr. Fatima Sheikh",
    specialty: "Pediatrics",
    rating: 5,
    consultationType: "in-clinic",
    quote:
      "Booking an evening slot after school hours changed everything for us. My son's vaccination schedule is tracked automatically and I stopped worrying about missing a date.",
    date: "3 weeks ago",
  },
  {
    id: "t-04",
    patientName: "Arvind Menon",
    patientCity: "Kochi",
    doctorName: "Dr. Arjun Nair",
    specialty: "Orthopedics",
    rating: 4,
    consultationType: "in-clinic",
    quote:
      "Knee replacement at sixty-three is daunting. Having the whole recovery plan, physiotherapy sessions and progress notes in one place made it far less frightening.",
    date: "2 months ago",
  },
  {
    id: "t-05",
    patientName: "Nandita Bose",
    patientCity: "Kolkata",
    doctorName: "Dr. Sameer Qureshi",
    specialty: "Psychiatry",
    rating: 5,
    consultationType: "video",
    quote:
      "Being able to speak to a psychiatrist from home, without a waiting room, is the only reason I started. Six months on, I have not missed a session.",
    date: "1 week ago",
  },
  {
    id: "t-06",
    patientName: "Harpreet Singh",
    patientCity: "Delhi",
    doctorName: "Dr. Ritu Malhotra",
    specialty: "General Medicine",
    rating: 5,
    consultationType: "phone",
    quote:
      "I called about a fever at nine in the morning and had a prescription by half past. The medicines arrived before lunch.",
    date: "4 days ago",
  },
];
