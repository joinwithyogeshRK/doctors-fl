import type { Address, Order } from "@/types";

export const savedAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Alex Fernandes",
    line1: "402, Lakeview Residency, 12th Main",
    landmark: "Opposite Indiranagar Metro",
    city: "Bengaluru",
    pincode: "560038",
    phone: "+91 98450 11234",
  },
  {
    id: "addr-2",
    label: "Office",
    name: "Alex Fernandes",
    line1: "Level 7, Orion Tech Park, Outer Ring Road",
    landmark: "Near Bellandur Lake",
    city: "Bengaluru",
    pincode: "560103",
    phone: "+91 98450 11234",
  },
];

export const orders: Order[] = [
  {
    id: "MH-ORD-48217",
    placedAt: "22 Nov 2026, 10:14 AM",
    stage: "out-for-delivery",
    items: [
      { medicineId: "h-01", quantity: 2 },
      { medicineId: "h-03", quantity: 1 },
      { medicineId: "v-01", quantity: 1 },
    ],
    subtotal: 290,
    discount: 29,
    deliveryFee: 0,
    tax: 15,
    total: 276,
    address: savedAddresses[0],
    speed: "express",
    payment: "upi",
    paid: true,
    rider: { name: "Mahesh K.", vehicle: "Scooter · KA 05 HJ 2210", phone: "+91 98860 77121" },
    eta: "Today, by 2:45 PM",
  },
  {
    id: "MH-ORD-47980",
    placedAt: "16 Nov 2026, 06:32 PM",
    stage: "delivered",
    items: [
      { medicineId: "x-02", quantity: 1 },
      { medicineId: "f-01", quantity: 1 },
    ],
    subtotal: 410,
    discount: 0,
    deliveryFee: 40,
    tax: 21,
    total: 471,
    address: savedAddresses[0],
    speed: "standard",
    payment: "card",
    paid: true,
    rider: { name: "Divya R.", vehicle: "Scooter · KA 03 MN 8841", phone: "+91 98860 77122" },
    eta: "Delivered 17 Nov, 11:20 AM",
  },
  {
    id: "MH-ORD-47612",
    placedAt: "04 Nov 2026, 09:05 AM",
    stage: "delivered",
    items: [{ medicineId: "v-04", quantity: 1 }],
    subtotal: 549,
    discount: 82,
    deliveryFee: 0,
    tax: 23,
    total: 490,
    address: savedAddresses[1],
    speed: "scheduled",
    payment: "wallet",
    paid: true,
    rider: { name: "Sanjay P.", vehicle: "Bike · KA 01 BR 5512", phone: "+91 98860 77123" },
    eta: "Delivered 05 Nov, 09:40 AM",
  },
];

export const orderStages: { stage: Order["stage"]; label: string; note: string }[] = [
  { stage: "placed", label: "Order placed", note: "We received your order" },
  { stage: "confirmed", label: "Order confirmed", note: "Payment and items verified" },
  { stage: "preparing", label: "Pharmacy preparing order", note: "Items picked from the shelf" },
  { stage: "verified", label: "Pharmacist verification", note: "Checked against your prescription" },
  { stage: "packed", label: "Packed", note: "Sealed and labelled for dispatch" },
  { stage: "out-for-delivery", label: "Out for delivery", note: "On the way to your address" },
  { stage: "delivered", label: "Delivered", note: "Handed over at your door" },
];

export const deliveryOptions = [
  { id: "standard" as const, label: "Standard delivery", eta: "Tomorrow, by 6 PM", fee: 40 },
  { id: "express" as const, label: "Express delivery", eta: "Within 3 hours", fee: 79 },
  { id: "scheduled" as const, label: "Scheduled delivery", eta: "Pick a 2-hour window", fee: 0 },
];
