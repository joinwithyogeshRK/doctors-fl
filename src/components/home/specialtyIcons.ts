import {
  Baby,
  Bone,
  Brain,
  BrainCircuit,
  Ear,
  Eye,
  Flower2,
  HeartPulse,
  Smile,
  Soup,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SpecialtySlug } from "@/types";

export const specialtyIcons: Record<SpecialtySlug, LucideIcon> = {
  cardiology: HeartPulse,
  neurology: Brain,
  orthopedics: Bone,
  pediatrics: Baby,
  dermatology: Sparkles,
  dentistry: Smile,
  "general-medicine": Stethoscope,
  gynecology: Flower2,
  ophthalmology: Eye,
  ent: Ear,
  psychiatry: BrainCircuit,
  gastroenterology: Soup,
};
