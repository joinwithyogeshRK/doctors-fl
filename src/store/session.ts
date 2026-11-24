"use client";

import { createPersistentStore } from "@/lib/store";
import type { DemoRole } from "@/types";

export interface Session {
  role: DemoRole | null;
  name: string;
}

const empty: Session = { role: null, name: "" };

const store = createPersistentStore<Session>("mh.session", empty);

export const demoAccounts: Record<DemoRole, { name: string; home: string; blurb: string }> = {
  patient: {
    name: "Alex Fernandes",
    home: "/patient/dashboard",
    blurb: "Appointments, records, prescriptions and orders",
  },
  doctor: {
    name: "Dr. Ananya Rao",
    home: "/doctor/dashboard",
    blurb: "Clinic schedule, patients and prescriptions",
  },
  admin: {
    name: "Priya Nambiar",
    home: "/admin/dashboard",
    blurb: "Platform analytics and management",
  },
};

export function signInAs(role: DemoRole) {
  store.set({ role, name: demoAccounts[role].name });
}

export function signOut() {
  store.set(empty);
}

export function useSession(): Session {
  return store.useStore();
}
