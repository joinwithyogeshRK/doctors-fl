import type { Coupon, Medicine, MedicineCategory } from "@/types";

export const medicineCategories: {
  slug: MedicineCategory;
  name: string;
  blurb: string;
}[] = [
  { slug: "pain-relief", name: "Pain relief", blurb: "Everyday aches, fever and inflammation" },
  { slug: "cold-and-flu", name: "Cold and flu", blurb: "Congestion, cough and sore throat" },
  { slug: "vitamins", name: "Vitamins and supplements", blurb: "Daily nutrition and deficiencies" },
  { slug: "diabetes-care", name: "Diabetes care", blurb: "Monitoring and daily management" },
  { slug: "heart-health", name: "Heart health", blurb: "Blood pressure and cholesterol" },
  { slug: "skin-care", name: "Skin care", blurb: "Medicated and everyday skin" },
  { slug: "baby-care", name: "Baby care", blurb: "Gentle essentials for infants" },
  { slug: "first-aid", name: "First aid", blurb: "Dressings, antiseptics and kits" },
  { slug: "devices", name: "Medical devices", blurb: "Monitors, meters and trackers" },
];

const m = (
  id: string,
  name: string,
  brand: string,
  strength: string,
  packSize: string,
  category: MedicineCategory,
  price: number,
  mrp: number,
  rating: number,
  reviewCount: number,
  opts: Partial<Medicine> = {},
): Medicine => ({
  id,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
  brand,
  strength,
  packSize,
  category,
  price,
  mrp,
  rating,
  reviewCount,
  inStock: true,
  prescriptionRequired: false,
  store: category === "devices" ? "wellness" : "pharmacy",
  description: `${name} from ${brand}.`,
  ingredients: [],
  manufacturer: brand,
  dosageNote: "Follow the dosage printed on the pack or advised by your doctor.",
  tags: [],
  ...opts,
});

export const medicines: Medicine[] = [
  m("p-01", "Paracetamol 650", "Medipure", "650 mg", "Strip of 15 tablets", "pain-relief", 32, 42, 4.6, 1840, {
    description:
      "Relieves fever and mild to moderate pain. One of the most widely used over-the-counter medicines in India.",
    ingredients: ["Paracetamol IP 650 mg"],
    tags: ["Fever", "Headache", "Body ache"],
  }),
  m("p-02", "Ibuprofen 400", "Medipure", "400 mg", "Strip of 10 tablets", "pain-relief", 46, 58, 4.4, 920, {
    description: "Anti-inflammatory tablet for period pain, dental pain and muscular injury.",
    ingredients: ["Ibuprofen IP 400 mg"],
    tags: ["Inflammation", "Period pain"],
  }),
  m("p-03", "Diclofenac Gel", "Relivo", "1% w/w", "30 g tube", "pain-relief", 118, 145, 4.5, 612, {
    description: "Topical gel for joint and muscle pain, absorbed at the site of application.",
    ingredients: ["Diclofenac Diethylamine 1.16% w/w"],
    tags: ["Joint pain", "Topical"],
  }),
  m("p-04", "Tramadol 50", "Medipure", "50 mg", "Strip of 10 capsules", "pain-relief", 94, 120, 4.2, 148, {
    prescriptionRequired: true,
    description: "Prescription-only analgesic for moderate to severe pain.",
    ingredients: ["Tramadol Hydrochloride IP 50 mg"],
    tags: ["Prescription", "Severe pain"],
  }),

  m("c-01", "Cetirizine 10", "Breathewell", "10 mg", "Strip of 10 tablets", "cold-and-flu", 28, 36, 4.5, 1340, {
    description: "Antihistamine for sneezing, runny nose and allergic itching.",
    ingredients: ["Cetirizine Hydrochloride IP 10 mg"],
    tags: ["Allergy", "Runny nose"],
  }),
  m("c-02", "Cough Syrup Dry", "Breathewell", "100 ml", "Single bottle", "cold-and-flu", 134, 168, 4.3, 756, {
    description: "Soothes a persistent dry cough and calms throat irritation.",
    ingredients: ["Dextromethorphan", "Chlorpheniramine Maleate"],
    tags: ["Dry cough", "Syrup"],
  }),
  m("c-03", "Steam Inhalant Capsules", "Breathewell", "0.5 ml", "Pack of 10", "cold-and-flu", 86, 99, 4.4, 410, {
    description: "Menthol and eucalyptus capsules for steam inhalation during blocked nose.",
    ingredients: ["Menthol", "Eucalyptus oil", "Camphor"],
    tags: ["Congestion", "Inhalation"],
  }),
  m("c-04", "Azithromycin 500", "Medipure", "500 mg", "Strip of 3 tablets", "cold-and-flu", 96, 118, 4.4, 332, {
    prescriptionRequired: true,
    description: "Antibiotic for bacterial respiratory infections. Prescription required.",
    ingredients: ["Azithromycin IP 500 mg"],
    tags: ["Antibiotic", "Prescription"],
  }),

  m("v-01", "Vitamin D3 60000 IU", "Vitalis", "60000 IU", "Pack of 4 sachets", "vitamins", 182, 240, 4.7, 2210, {
    description: "Weekly sachet for correcting vitamin D deficiency, taken with milk.",
    ingredients: ["Cholecalciferol 60000 IU"],
    tags: ["Deficiency", "Weekly dose"],
  }),
  m("v-02", "Vitamin B12 Tablets", "Vitalis", "1500 mcg", "Bottle of 60 tablets", "vitamins", 265, 330, 4.6, 1180, {
    description: "Supports nerve function and energy levels, often needed on a vegetarian diet.",
    ingredients: ["Methylcobalamin 1500 mcg"],
    tags: ["Energy", "Vegetarian"],
  }),
  m("v-03", "Iron and Folic Acid", "Vitalis", "100 mg", "Strip of 30 tablets", "vitamins", 148, 190, 4.5, 884, {
    description: "Iron supplement with folic acid for anaemia and pregnancy support.",
    ingredients: ["Ferrous Ascorbate 100 mg", "Folic Acid 1.5 mg"],
    tags: ["Anaemia", "Pregnancy"],
  }),
  m("v-04", "Omega 3 Fish Oil", "Vitalis", "1000 mg", "Bottle of 60 capsules", "vitamins", 549, 699, 4.5, 1526, {
    description: "Concentrated fish oil supporting heart and joint health.",
    ingredients: ["EPA 180 mg", "DHA 120 mg"],
    tags: ["Heart", "Joints"],
  }),
  m("v-05", "Multivitamin Daily", "Vitalis", "—", "Bottle of 90 tablets", "vitamins", 420, 560, 4.4, 998, {
    description: "A broad daily multivitamin with minerals and antioxidants.",
    ingredients: ["Vitamin A, C, D, E", "Zinc", "Selenium"],
    tags: ["Daily", "Immunity"],
  }),

  m("d-01", "Metformin 500", "Medipure", "500 mg", "Strip of 15 tablets", "diabetes-care", 38, 48, 4.5, 1420, {
    prescriptionRequired: true,
    description: "First-line tablet for type 2 diabetes. Prescription required.",
    ingredients: ["Metformin Hydrochloride IP 500 mg"],
    tags: ["Type 2 diabetes", "Prescription"],
  }),
  m("d-02", "Glucose Test Strips", "Accucheck Plus", "—", "Pack of 50 strips", "diabetes-care", 735, 899, 4.6, 640, {
    description: "Test strips compatible with most home glucose meters.",
    ingredients: [],
    tags: ["Monitoring", "Consumable"],
  }),
  m("d-03", "Sugar Free Sweetener", "Vitalis", "—", "Pack of 100 tablets", "diabetes-care", 155, 185, 4.3, 512, {
    description: "Low-calorie sweetener for tea, coffee and cooking.",
    ingredients: ["Sucralose"],
    tags: ["Low calorie"],
  }),
  m("d-04", "Insulin Pen Needles", "Accucheck Plus", "31G", "Pack of 100 needles", "diabetes-care", 640, 780, 4.5, 221, {
    inStock: false,
    description: "Fine-gauge pen needles for daily insulin administration.",
    ingredients: [],
    tags: ["Insulin", "Consumable"],
  }),

  m("h-01", "Amlodipine 5", "Cardiacare", "5 mg", "Strip of 15 tablets", "heart-health", 42, 55, 4.5, 760, {
    prescriptionRequired: true,
    description: "Blood pressure tablet taken once daily. Prescription required.",
    ingredients: ["Amlodipine Besylate IP 5 mg"],
    tags: ["Blood pressure", "Prescription"],
  }),
  m("h-02", "Atorvastatin 10", "Cardiacare", "10 mg", "Strip of 15 tablets", "heart-health", 88, 112, 4.4, 538, {
    prescriptionRequired: true,
    description: "Lowers cholesterol as part of a long-term heart care plan.",
    ingredients: ["Atorvastatin Calcium IP 10 mg"],
    tags: ["Cholesterol", "Prescription"],
  }),
  m("h-03", "Low Dose Aspirin", "Cardiacare", "75 mg", "Strip of 14 tablets", "heart-health", 24, 32, 4.6, 1104, {
    description: "Low-dose aspirin used for cardiovascular protection under medical advice.",
    ingredients: ["Aspirin IP 75 mg"],
    tags: ["Preventive"],
  }),

  m("s-01", "Ceramide Moisturiser", "Clearskin", "—", "100 g jar", "skin-care", 465, 580, 4.7, 1890, {
    description: "Fragrance-free moisturiser for dry and eczema-prone skin.",
    ingredients: ["Ceramides", "Hyaluronic acid", "Glycerin"],
    tags: ["Dry skin", "Eczema"],
  }),
  m("s-02", "Mineral Sunscreen SPF 50", "Clearskin", "SPF 50 PA+++", "50 g tube", "skin-care", 520, 650, 4.6, 2340, {
    description: "Broad-spectrum mineral sunscreen that does not leave a white cast.",
    ingredients: ["Zinc oxide", "Titanium dioxide"],
    tags: ["Sun protection", "Daily"],
  }),
  m("s-03", "Adapalene Gel", "Clearskin", "0.1% w/w", "15 g tube", "skin-care", 298, 365, 4.5, 702, {
    prescriptionRequired: true,
    description: "Retinoid gel for acne, applied at night. Prescription required.",
    ingredients: ["Adapalene 0.1% w/w"],
    tags: ["Acne", "Prescription"],
  }),
  m("s-04", "Ketoconazole Shampoo", "Clearskin", "2% w/v", "100 ml bottle", "skin-care", 345, 420, 4.4, 486, {
    description: "Medicated shampoo for dandruff and seborrhoeic dermatitis.",
    ingredients: ["Ketoconazole 2% w/v"],
    tags: ["Dandruff", "Scalp"],
  }),

  m("b-01", "Baby Gripe Water", "Littlecare", "130 ml", "Single bottle", "baby-care", 112, 140, 4.5, 1260, {
    description: "Traditional remedy for infant colic and wind, alcohol free.",
    ingredients: ["Dill oil", "Sodium bicarbonate"],
    tags: ["Colic", "Infant"],
  }),
  m("b-02", "Baby Barrier Cream", "Littlecare", "—", "100 g tube", "baby-care", 268, 320, 4.6, 940, {
    description: "Protective nappy cream for sore and irritated skin.",
    ingredients: ["Zinc oxide", "Dexpanthenol"],
    tags: ["Nappy rash"],
  }),
  m("b-03", "Infant Paracetamol Drops", "Littlecare", "100 mg/ml", "15 ml bottle", "baby-care", 78, 95, 4.5, 820, {
    description: "Fever and pain drops for infants, dosed by weight.",
    ingredients: ["Paracetamol IP 100 mg/ml"],
    dosageNote: "Dose strictly by your paediatrician's instruction and your baby's weight.",
    tags: ["Fever", "Infant"],
  }),

  m("f-01", "Antiseptic Liquid", "Medipure", "—", "250 ml bottle", "first-aid", 165, 199, 4.6, 1540, {
    description: "Dilute for cleaning minor cuts, grazes and surfaces.",
    ingredients: ["Chloroxylenol 4.8% w/v"],
    tags: ["Wounds", "Household"],
  }),
  m("f-02", "Adhesive Bandages", "Medipure", "—", "Pack of 40", "first-aid", 95, 120, 4.5, 880, {
    description: "Assorted waterproof dressings for everyday cuts.",
    ingredients: [],
    tags: ["Dressing"],
  }),
  m("f-03", "Home First Aid Kit", "Medipure", "—", "32-piece kit", "first-aid", 899, 1150, 4.7, 410, {
    description: "A compact kit with dressings, antiseptic, scissors and a burn gel.",
    ingredients: [],
    tags: ["Kit", "Home"],
  }),

  m("x-01", "Digital Blood Pressure Monitor", "Accucheck Plus", "—", "Upper-arm cuff", "devices", 2150, 2899, 4.6, 1320, {
    description: "Clinically validated upper-arm monitor storing 90 readings for two users.",
    ingredients: [],
    tags: ["Blood pressure", "Monitor"],
  }),
  m("x-02", "Digital Thermometer", "Accucheck Plus", "—", "Single unit", "devices", 245, 320, 4.5, 2060, {
    description: "Fast-read thermometer with fever alarm and flexible tip.",
    ingredients: [],
    tags: ["Fever", "Family"],
  }),
  m("x-03", "Glucose Meter Kit", "Accucheck Plus", "—", "Meter + 10 strips", "devices", 1299, 1699, 4.5, 988, {
    description: "Starter kit with meter, lancing device and ten test strips.",
    ingredients: [],
    tags: ["Diabetes", "Kit"],
  }),
  m("x-04", "Fingertip Pulse Oximeter", "Accucheck Plus", "—", "Single unit", "devices", 1050, 1399, 4.4, 1740, {
    description: "Measures blood oxygen and pulse rate in under ten seconds.",
    ingredients: [],
    tags: ["SpO2", "Monitor"],
  }),
  m("x-05", "Fitness and Heart Tracker", "Vitalis", "—", "Single unit", "devices", 3499, 4499, 4.3, 620, {
    description: "Wrist tracker logging steps, sleep and continuous heart rate.",
    ingredients: [],
    tags: ["Wearable", "Activity"],
  }),
  m("x-06", "Nebuliser Machine", "Accucheck Plus", "—", "With mask set", "devices", 1850, 2400, 4.5, 365, {
    inStock: false,
    description: "Compressor nebuliser with adult and paediatric masks.",
    ingredients: [],
    tags: ["Asthma", "Respiratory"],
  }),
  m("x-07", "Folding Walking Stick", "Vitalis", "—", "Adjustable height", "devices", 940, 1250, 4.4, 208, {
    description: "Lightweight aluminium stick that folds into four for travel.",
    ingredients: [],
    tags: ["Mobility", "Support"],
  }),
  m("x-08", "Weighing Scale", "Vitalis", "—", "Up to 180 kg", "devices", 1150, 1499, 4.3, 740, {
    description: "Glass digital scale with step-on activation and BMI readout.",
    ingredients: [],
    tags: ["Weight", "Home"],
  }),
];

export const medicineBySlug = Object.fromEntries(
  medicines.map((item) => [item.slug, item]),
) as Record<string, Medicine>;

export const medicineById = Object.fromEntries(
  medicines.map((item) => [item.id, item]),
) as Record<string, Medicine>;

export const coupons: Coupon[] = [
  { code: "HEALTH10", label: "10% off your order", percent: 10, maxDiscount: 300, minSpend: 299 },
  { code: "WELCOME15", label: "15% off your first order", percent: 15, maxDiscount: 500, minSpend: 499 },
];

export function discountPercent(item: Medicine): number {
  return Math.round(((item.mrp - item.price) / item.mrp) * 100);
}
