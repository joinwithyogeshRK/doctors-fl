/** Mock series for the admin and doctor analytics views. */

export const appointmentsOverTime = [
  { month: "Jun", inClinic: 412, video: 188 },
  { month: "Jul", inClinic: 458, video: 221 },
  { month: "Aug", inClinic: 437, video: 264 },
  { month: "Sep", inClinic: 502, video: 298 },
  { month: "Oct", inClinic: 544, video: 341 },
  { month: "Nov", inClinic: 589, video: 402 },
];

export const revenueByMonth = [
  { month: "Jun", amount: 1840000 },
  { month: "Jul", amount: 2010000 },
  { month: "Aug", amount: 1960000 },
  { month: "Sep", amount: 2280000 },
  { month: "Oct", amount: 2520000 },
  { month: "Nov", amount: 2870000 },
];

export const popularSpecialties = [
  { name: "General Medicine", share: 24 },
  { name: "Cardiology", share: 19 },
  { name: "Pediatrics", share: 15 },
  { name: "Orthopedics", share: 13 },
  { name: "Dermatology", share: 11 },
  { name: "Others", share: 18 },
];

export const patientGrowth = [
  { month: "Jun", patients: 38200 },
  { month: "Jul", patients: 40100 },
  { month: "Aug", patients: 42400 },
  { month: "Sep", patients: 44900 },
  { month: "Oct", patients: 47600 },
  { month: "Nov", patients: 50240 },
];

export const pharmacyOrders = [
  { month: "Jun", orders: 2140 },
  { month: "Jul", orders: 2380 },
  { month: "Aug", orders: 2290 },
  { month: "Sep", orders: 2710 },
  { month: "Oct", orders: 3020 },
  { month: "Nov", orders: 3345 },
];

export const doctorPerformance = [
  { name: "Dr. Ananya Rao", consultations: 184, rating: 4.9, revenue: 165600 },
  { name: "Dr. Fatima Sheikh", consultations: 212, rating: 4.9, revenue: 137800 },
  { name: "Dr. Rahul Banerjee", consultations: 246, rating: 4.6, revenue: 123000 },
  { name: "Dr. Meera Krishnan", consultations: 158, rating: 4.9, revenue: 150100 },
  { name: "Dr. Vikram Mehta", consultations: 121, rating: 4.8, revenue: 133100 },
];

export const doctorWeek = [
  { day: "Mon", booked: 11, capacity: 14 },
  { day: "Tue", booked: 13, capacity: 14 },
  { day: "Wed", booked: 9, capacity: 14 },
  { day: "Thu", booked: 14, capacity: 14 },
  { day: "Fri", booked: 12, capacity: 14 },
  { day: "Sat", booked: 7, capacity: 10 },
  { day: "Sun", booked: 0, capacity: 0 },
];

export const satisfactionTrend = [
  { month: "Jun", score: 94 },
  { month: "Jul", score: 95 },
  { month: "Aug", score: 95 },
  { month: "Sep", score: 96 },
  { month: "Oct", score: 97 },
  { month: "Nov", score: 98 },
];
