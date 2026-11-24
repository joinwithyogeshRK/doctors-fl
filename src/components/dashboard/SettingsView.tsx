"use client";

import { useState } from "react";
import { Bell, Globe, Lock, Palette, Trash2 } from "lucide-react";
import { cx } from "@/lib/format";
import { Card, CardTitle, PageHeader } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/providers/ToastProvider";
import { resetNotifications } from "@/store/notifications";

interface Toggle {
  id: string;
  label: string;
  description: string;
  on: boolean;
}

export function SettingsView({ role }: { role: "patient" | "doctor" | "admin" }) {
  const { toast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const [toggles, setToggles] = useState<Toggle[]>(
    role === "doctor"
      ? [
          { id: "new-booking", label: "New booking alerts", description: "Notify me when a patient books a slot", on: true },
          { id: "cancellations", label: "Cancellations", description: "Alert me when a slot frees up", on: true },
          { id: "reviews", label: "New reviews", description: "Tell me when a patient leaves feedback", on: false },
          { id: "digest", label: "Daily summary", description: "A morning list of the day's clinic", on: true },
        ]
      : [
          { id: "reminders", label: "Appointment reminders", description: "A day before and an hour before", on: true },
          { id: "orders", label: "Order updates", description: "Packing, dispatch and delivery", on: true },
          { id: "prescriptions", label: "Prescription alerts", description: "When a doctor issues or renews one", on: true },
          { id: "offers", label: "Offers and health tips", description: "Occasional pharmacy offers and articles", on: false },
        ],
  );

  const flip = (id: string) =>
    setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, on: !t.on } : t)));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" lede="Notifications, language and account preferences." />

      <div className="mt-7 space-y-5">
        <Card>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Bell size={17} className="text-electric" />
              Notifications
            </span>
          </CardTitle>
          <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
            {toggles.map((toggle) => (
              <li key={toggle.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{toggle.label}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{toggle.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggle.on}
                  aria-label={toggle.label}
                  onClick={() => flip(toggle.id)}
                  className={cx(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                    toggle.on ? "bg-electric" : "bg-[#ccd6e9]",
                  )}
                >
                  <span
                    className={cx(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                      toggle.on ? "translate-x-5.5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Globe size={17} className="text-electric" />
              Language and region
            </span>
          </CardTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField label="Language" defaultValue="en-IN">
              <option value="en-IN">English (India)</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
              <option value="bn">বাংলা</option>
            </SelectField>
            <SelectField label="Time zone" defaultValue="ist">
              <option value="ist">India Standard Time (GMT+5:30)</option>
              <option value="gst">Gulf Standard Time (GMT+4)</option>
            </SelectField>
          </div>
        </Card>

        <Card>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Lock size={17} className="text-electric" />
              Security
            </span>
          </CardTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Current password" type="password" placeholder="••••••••" />
            <TextField label="New password" type="password" placeholder="At least 8 characters" />
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => toast("info", "Password changes are not part of this demo")}
          >
            Update password
          </Button>
        </Card>

        <Card>
          <CardTitle>
            <span className="flex items-center gap-2">
              <Palette size={17} className="text-electric" />
              Demo data
            </span>
          </CardTitle>
          <p className="text-sm leading-relaxed text-ink-soft">
            This demonstration keeps your cart, bookings and notifications in your browser&rsquo;s
            local storage. Resetting returns everything to how it looked on first load.
          </p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => setConfirmReset(true)}>
            <Trash2 size={15} />
            Reset demo data
          </Button>
        </Card>
      </div>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset the demo?"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Keep my changes
            </Button>
            <Button
              onClick={() => {
                try {
                  Object.keys(window.localStorage)
                    .filter((key) => key.startsWith("mh."))
                    .forEach((key) => window.localStorage.removeItem(key));
                } catch {
                  /* storage may be unavailable */
                }
                resetNotifications();
                setConfirmReset(false);
                toast("success", "Demo data reset", "Reloading to apply.");
                window.setTimeout(() => window.location.reload(), 700);
              }}
            >
              Reset everything
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-ink-soft">
          Your cart, saved doctors, bookings made in this demo and notification states will go back
          to their starting values. Nothing on a server is affected.
        </p>
      </Dialog>
    </div>
  );
}
