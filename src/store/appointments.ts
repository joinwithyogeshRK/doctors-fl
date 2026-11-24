"use client";

import { createPersistentStore } from "@/lib/store";
import { appointments as seed, doctorAppointments as doctorSeed } from "@/data/appointments";
import type { Appointment, AppointmentStatus } from "@/types";

const patientStore = createPersistentStore<Appointment[]>("mh.appointments", seed);
const clinicStore = createPersistentStore<Appointment[]>("mh.clinic", doctorSeed);

export function bookAppointment(appointment: Appointment) {
  patientStore.set((prev) => [appointment, ...prev]);
}

export function setAppointmentStatus(id: string, status: AppointmentStatus) {
  patientStore.set((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
}

export function rescheduleAppointment(id: string, date: string, time: string) {
  patientStore.set((prev) =>
    prev.map((a) => (a.id === id ? { ...a, date, time, status: "upcoming" } : a)),
  );
}

export function usePatientAppointments(): Appointment[] {
  return patientStore.useStore();
}

export function setClinicStatus(id: string, status: AppointmentStatus) {
  clinicStore.set((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
}

export function useClinicAppointments(): Appointment[] {
  return clinicStore.useStore();
}

/** Six-character booking reference, deterministic per call site. */
export function makeBookingId(seedValue: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let n = Math.abs(Math.floor(seedValue));
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length) + 7;
  }
  return `APT-${out}`;
}
