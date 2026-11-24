export function formatFee(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const consultationLabel: Record<string, string> = {
  "in-clinic": "In clinic",
  video: "Video",
  phone: "Phone",
};
