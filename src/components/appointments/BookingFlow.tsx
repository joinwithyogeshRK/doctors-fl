"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  Download,
  Landmark,
  Phone,
  RotateCcw,
  Search,
  Smartphone,
  Stethoscope,
  Video,
  XCircle,
} from "lucide-react";
import { doctors, doctorBySlug } from "@/data/doctors";
import { allSlots, bookedSlots } from "@/data/appointments";
import { consultationLabel, cx, formatFee } from "@/lib/format";
import { formatLongDate } from "@/hooks/useToday";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surfaces";
import { Stepper } from "@/components/ui/Stepper";
import { Calendar, SlotGrid } from "@/components/ui/Calendar";
import { OptionCards, SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { Stars } from "@/components/ui/Stars";
import { LiveDot } from "@/components/ui/Badge";
import { slotsForDoctor } from "@/components/doctors/BookingPanel";
import { bookAppointment, makeBookingId } from "@/store/appointments";
import { pushNotification } from "@/store/notifications";
import { useToast } from "@/components/providers/ToastProvider";
import { calendarInvite, downloadFile, receiptText } from "@/components/appointments/bookingUtils";
import type { ConsultationType, PaymentMethod } from "@/types";

const STEPS = [
  "Doctor",
  "Consultation type",
  "Date",
  "Time",
  "Your details",
  "Review",
  "Payment",
  "Confirmed",
];

interface PatientForm {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  reason: string;
  existing: "new" | "existing";
}

const emptyForm: PatientForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  reason: "",
  existing: "new",
};

const paymentMethods: { value: PaymentMethod; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "upi", label: "UPI", description: "Pay with any UPI app", icon: <Smartphone size={18} /> },
  { value: "card", label: "Card", description: "Credit or debit card", icon: <CreditCard size={18} /> },
  { value: "netbanking", label: "Net banking", description: "All major banks", icon: <Landmark size={18} /> },
  { value: "pay-at-clinic", label: "Pay at clinic", description: "Settle when you arrive", icon: <Banknote size={18} /> },
];

/**
 * Next keeps this component mounted when only the query string changes, so the
 * useState initialisers below would hold on to the previous link's values.
 * Keying on the query gives every incoming link a clean instance.
 */
export function BookingFlow() {
  const params = useSearchParams();
  return <BookingFlowInner key={params.toString()} />;
}

function BookingFlowInner() {
  const params = useSearchParams();
  const { toast } = useToast();
  const reduce = useReducedMotion();

  const [step, setStep] = useState(() => {
    if (!params.get("doctor")) return 0;
    if (params.get("time")) return 4;
    if (params.get("date")) return 3;
    return 1;
  });

  const [doctorSlug, setDoctorSlug] = useState<string | null>(params.get("doctor"));
  const [type, setType] = useState<ConsultationType | null>(
    (params.get("type") as ConsultationType) ?? null,
  );
  const [date, setDate] = useState<string | null>(params.get("date"));
  const [time, setTime] = useState<string | null>(params.get("time"));
  const [form, setForm] = useState<PatientForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof PatientForm, string>>>({});
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [payState, setPayState] = useState<"idle" | "processing" | "failed">("idle");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const doctor = doctorSlug ? doctorBySlug[doctorSlug] : null;

  const shortlist = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter((d) =>
      [d.name, d.specialty, d.hospital, d.location, ...d.expertise]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const taken = useMemo(() => (date ? (bookedSlots[date] ?? []) : []), [date]);
  const offered = useMemo(() => {
    if (!doctor || !date) return [];
    const free = slotsForDoctor(doctor, date);
    return Array.from(new Set([...free, ...taken])).sort(
      (a, b) => allSlots.indexOf(a) - allSlots.indexOf(b),
    );
  }, [doctor, date, taken]);

  const validateForm = (): boolean => {
    const next: Partial<Record<keyof PatientForm, string>> = {};
    if (form.name.trim().length < 2) next.name = "Enter the patient's full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Enter an email we can send the confirmation to.";
    if (!/^[+\d][\d\s-]{8,}$/.test(form.phone.trim()))
      next.phone = "Enter a phone number with at least 9 digits.";
    const age = Number(form.age);
    if (!form.age || Number.isNaN(age) || age < 0 || age > 120)
      next.age = "Enter an age between 0 and 120.";
    if (!form.gender) next.gender = "Select an option.";
    if (form.reason.trim().length < 5) next.reason = "A few words about the reason help the doctor prepare.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return Boolean(doctorSlug);
      case 1:
        return Boolean(type);
      case 2:
        return Boolean(date);
      case 3:
        return Boolean(time);
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const next = () => {
    if (step === 4 && !validateForm()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const pay = () => {
    if (!method || !doctor || !date || !time || !type) return;
    setPayState("processing");

    window.setTimeout(() => {
      // One deliberate failure path so the retry state is reachable in the demo.
      if (method === "card" && form.phone.replace(/\D/g, "").endsWith("0")) {
        setPayState("failed");
        return;
      }

      const id = makeBookingId(date.replace(/-/g, "").length * 977 + time.length * 31 + doctor.slug.length);
      setBookingId(id);
      bookAppointment({
        id,
        doctorSlug: doctor.slug,
        patientId: "pt-01",
        date,
        time,
        type,
        status: "upcoming",
        reason: form.reason,
        fee: doctor.consultationFee,
        paid: method !== "pay-at-clinic",
      });
      pushNotification({
        id: `n-${id}`,
        kind: "appointment",
        title: "Appointment confirmed",
        body: `${doctor.name} on ${formatLongDate(date)} at ${time}.`,
        time: "Just now",
        read: false,
        href: "/patient/appointments",
      });
      setPayState("idle");
      setStep(7);
      toast("success", "Appointment confirmed", `Reference ${id}`);
    }, 1600);
  };

  const panel = (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 22 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, x: -18 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {step === 0 && (
          <Card>
            <h2 className="text-lg font-semibold text-ink">Who would you like to see?</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Search by name, specialty or the reason for your visit.
            </p>

            <div className="relative mt-5">
              <Search size={17} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cardiology, chest pain, Dr. Rao…"
                aria-label="Search doctors"
                className="h-12 w-full rounded-full border hairline bg-white pr-4 pl-11 text-sm text-ink focus:border-electric focus:outline-none"
              />
            </div>

            <div className="mt-4 max-h-[26rem] space-y-2 overflow-y-auto pr-1">
              {shortlist.length === 0 && (
                <p className="rounded-xl bg-mist px-4 py-6 text-center text-sm text-ink-soft">
                  No doctors match that search.
                </p>
              )}
              {shortlist.map((option) => {
                const selected = doctorSlug === option.slug;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setDoctorSlug(option.slug);
                      setType(option.consultationTypes[0]);
                      setDate(null);
                      setTime(null);
                    }}
                    aria-pressed={selected}
                    className={cx(
                      "flex w-full items-center gap-4 rounded-card border p-3.5 text-left transition-all",
                      selected
                        ? "border-electric bg-[color-mix(in_oklab,var(--color-electric)_6%,white)]"
                        : "hairline hover:border-electric/40 hover:bg-mist",
                    )}
                  >
                    <DoctorAvatar doctor={option} size={48} rounded="card" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{option.name}</span>
                      <span className="block truncate text-sm text-electric">{option.specialty}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-faint">
                        <Stars rating={option.rating} size={11} />
                        {option.rating} · {option.hospital}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-semibold text-ink">
                        {formatFee(option.consultationFee)}
                      </span>
                      {option.availableToday && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-mint">
                          <LiveDot />
                          Today
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {step === 1 && doctor && (
          <Card>
            <h2 className="text-lg font-semibold text-ink">How would you like to be seen?</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              {doctor.name} offers {doctor.consultationTypes.length} consultation{" "}
              {doctor.consultationTypes.length === 1 ? "type" : "types"}.
            </p>
            <div className="mt-6">
              <OptionCards
                name="consultation-type"
                value={type}
                onChange={(value) => setType(value)}
                columns={1}
                options={doctor.consultationTypes.map((option) => ({
                  value: option,
                  label:
                    option === "in-clinic"
                      ? "In-clinic consultation"
                      : option === "video"
                        ? "Video consultation"
                        : "Phone consultation",
                  description:
                    option === "in-clinic"
                      ? `Visit ${doctor.hospital}, ${doctor.location}`
                      : option === "video"
                        ? "Join from your browser — no app needed"
                        : "The clinic calls you at your booked time",
                  icon:
                    option === "in-clinic" ? (
                      <Stethoscope size={18} />
                    ) : option === "video" ? (
                      <Video size={18} />
                    ) : (
                      <Phone size={18} />
                    ),
                }))}
              />
            </div>
          </Card>
        )}

        {step === 2 && doctor && (
          <Card>
            <h2 className="text-lg font-semibold text-ink">Pick a date</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Dates with a green dot have slots open. The clinic is closed on Sundays.
            </p>
            <div className="mt-6">
              <Calendar
                value={date}
                onChange={(iso) => {
                  setDate(iso);
                  setTime(null);
                }}
                slotsOn={(iso) => slotsForDoctor(doctor, iso).length}
              />
            </div>
          </Card>
        )}

        {step === 3 && doctor && date && (
          <Card>
            <h2 className="text-lg font-semibold text-ink">Pick a time</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Slots on {formatLongDate(date)}. Struck-through times are already booked.
            </p>
            <div className="mt-6">
              {offered.length === 0 ? (
                <p className="rounded-xl bg-mist px-4 py-6 text-center text-sm text-ink-soft">
                  No slots left on this date.{" "}
                  <button type="button" onClick={back} className="font-semibold text-electric underline">
                    Choose another day
                  </button>
                </p>
              ) : (
                <SlotGrid slots={offered} booked={taken} value={time} onChange={setTime} />
              )}
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <h2 className="text-lg font-semibold text-ink">Patient details</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              The doctor sees this before your appointment.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <TextField
                label="Full name"
                required
                value={form.name}
                error={errors.name}
                placeholder="Alex Fernandes"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                required
                value={form.email}
                error={errors.email}
                placeholder="you@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextField
                label="Phone"
                type="tel"
                required
                value={form.phone}
                error={errors.phone}
                placeholder="+91 98450 11234"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <TextField
                label="Age"
                type="number"
                required
                min={0}
                max={120}
                value={form.age}
                error={errors.age}
                placeholder="34"
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <SelectField
                label="Gender"
                required
                value={form.gender}
                error={errors.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="undisclosed">Prefer not to say</option>
              </SelectField>
              <SelectField
                label="Have you seen us before?"
                value={form.existing}
                onChange={(e) =>
                  setForm({ ...form, existing: e.target.value as PatientForm["existing"] })
                }
              >
                <option value="new">New patient</option>
                <option value="existing">Existing patient</option>
              </SelectField>
              <div className="sm:col-span-2">
                <TextAreaField
                  label="Reason for the appointment"
                  required
                  rows={3}
                  value={form.reason}
                  error={errors.reason}
                  placeholder="Chest tightness when climbing stairs, for about three weeks."
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>
            </div>
          </Card>
        )}

        {step === 5 && doctor && date && time && type && (
          <Card>
            <h2 className="text-lg font-semibold text-ink">Check the details</h2>
            <p className="mt-1.5 text-sm text-ink-soft">Nothing is charged until the next step.</p>

            <dl className="mt-6 divide-y divide-[color-mix(in_oklab,var(--color-ink)_8%,transparent)]">
              <Row label="Doctor" value={`${doctor.name} · ${doctor.specialty}`} />
              <Row
                label="Where"
                value={
                  type === "in-clinic"
                    ? `${doctor.hospital}, ${doctor.location}`
                    : type === "video"
                      ? "Video consultation"
                      : "Phone consultation"
                }
              />
              <Row label="Date" value={formatLongDate(date)} />
              <Row label="Time" value={time} />
              <Row label="Patient" value={`${form.name}, ${form.age}`} />
              <Row label="Contact" value={`${form.phone} · ${form.email}`} />
              <Row label="Reason" value={form.reason} />
              <Row
                label="Consultation fee"
                value={formatFee(doctor.consultationFee)}
                emphasis
              />
            </dl>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="mt-5 text-sm font-semibold text-electric underline"
            >
              Edit patient details
            </button>
          </Card>
        )}

        {step === 6 && doctor && (
          <Card>
            {payState === "processing" ? (
              <div className="py-14 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ice">
                  <span className="h-7 w-7 animate-spin rounded-full border-2 border-electric border-t-transparent" />
                </span>
                <h2 className="mt-6 text-lg font-semibold text-ink">Confirming your booking</h2>
                <p className="mt-2 text-sm text-ink-soft">
                  Holding the slot and notifying the clinic. Don&rsquo;t close this page.
                </p>
              </div>
            ) : payState === "failed" ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-coral)_12%,white)] text-coral">
                  <XCircle size={30} />
                </span>
                <h2 className="mt-6 text-lg font-semibold text-ink">Payment didn&rsquo;t go through</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                  Your card was declined and nothing was charged. Your slot is held for another
                  nine minutes.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button onClick={() => setPayState("idle")}>
                    <RotateCcw size={16} />
                    Try again
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMethod("pay-at-clinic");
                      setPayState("idle");
                    }}
                  >
                    Pay at the clinic instead
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-ink">How would you like to pay?</h2>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Payments are simulated in this demonstration. No card is charged.
                </p>
                <div className="mt-6">
                  <OptionCards
                    name="payment"
                    value={method}
                    onChange={setMethod}
                    columns={2}
                    options={paymentMethods}
                  />
                </div>

                <dl className="mt-6 rounded-card bg-mist p-5">
                  <div className="flex justify-between text-sm text-ink-soft">
                    <dt>Consultation fee</dt>
                    <dd className="tnum">{formatFee(doctor.consultationFee)}</dd>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-ink-soft">
                    <dt>Platform fee</dt>
                    <dd className="text-mint">Waived</dd>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between border-t hairline pt-3">
                    <dt className="font-semibold text-ink">
                      {method === "pay-at-clinic" ? "Payable at the clinic" : "Payable now"}
                    </dt>
                    <dd className="font-display text-xl font-bold text-ink tnum">
                      {formatFee(doctor.consultationFee)}
                    </dd>
                  </div>
                </dl>

                <Button className="mt-6 w-full" size="lg" disabled={!method} onClick={pay}>
                  {method === "pay-at-clinic"
                    ? "Confirm booking"
                    : `Pay ${formatFee(doctor.consultationFee)}`}
                </Button>
              </>
            )}
          </Card>
        )}

        {step === 7 && doctor && date && time && type && bookingId && (
          <Confirmation
            bookingId={bookingId}
            doctorName={doctor.name}
            specialty={doctor.specialty}
            hospital={doctor.hospital}
            location={doctor.location}
            type={type}
            date={date}
            time={time}
            patient={form.name}
            fee={doctor.consultationFee}
            method={method ?? "upi"}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div>
      <Stepper steps={STEPS} current={step} onJump={step < 6 ? setStep : undefined} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
        <div className="min-w-0">{panel}</div>

        {/* Running summary */}
        {step < 7 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <h2 className="text-sm font-semibold text-ink">Your booking</h2>
              {doctor ? (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <DoctorAvatar doctor={doctor} size={44} rounded="card" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{doctor.name}</p>
                      <p className="truncate text-xs text-electric">{doctor.specialty}</p>
                    </div>
                  </div>
                  <dl className="mt-5 space-y-2.5 border-t hairline pt-4 text-sm">
                    <Mini label="Type" value={type ? consultationLabel[type] : "Not chosen"} />
                    <Mini label="Date" value={date ? formatLongDate(date) : "Not chosen"} />
                    <Mini label="Time" value={time ?? "Not chosen"} />
                    <Mini label="Fee" value={formatFee(doctor.consultationFee)} />
                  </dl>
                  <p className="mt-4 flex items-center gap-2 rounded-xl bg-mist px-3 py-2.5 text-xs text-ink-soft">
                    <Building2 size={14} className="shrink-0" />
                    {doctor.hospital}, {doctor.location}
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm text-ink-soft">
                  Choose a doctor and your booking summary appears here.
                </p>
              )}
            </Card>
          </aside>
        )}
      </div>

      {step < 6 && (
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={back} disabled={step === 0}>
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button onClick={next} disabled={!canAdvance()} size="lg">
            {step === 5 ? "Continue to payment" : "Continue"}
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 py-3.5">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className={cx("text-right text-sm", emphasis ? "font-display text-lg font-bold text-ink" : "font-medium text-ink")}>
        {value}
      </dd>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="text-right text-xs font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Confirmation(props: {
  bookingId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  location: string;
  type: ConsultationType;
  date: string;
  time: string;
  patient: string;
  fee: number;
  method: PaymentMethod;
}) {
  const methodLabel =
    paymentMethods.find((m) => m.value === props.method)?.label ?? "UPI";

  return (
    <Card className="text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
        <CheckCircle2 size={32} />
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold text-ink">Your appointment is booked</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
        A confirmation has been added to your account. The clinic will send a reminder the day
        before.
      </p>

      <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-ice px-4 py-2 text-sm font-semibold text-ink">
        Reference
        <span className="font-display tracking-wide text-electric tnum">{props.bookingId}</span>
      </p>

      <dl className="mt-6 divide-y divide-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] text-left">
        <Row label="Doctor" value={`${props.doctorName} · ${props.specialty}`} />
        <Row
          label="Where"
          value={
            props.type === "in-clinic"
              ? `${props.hospital}, ${props.location}`
              : `${consultationLabel[props.type]} consultation`
          }
        />
        <Row label="Date" value={formatLongDate(props.date)} />
        <Row label="Time" value={props.time} />
        <Row
          label="Payment"
          value={
            props.method === "pay-at-clinic"
              ? `${formatFee(props.fee)} payable at the clinic`
              : `${formatFee(props.fee)} paid by ${methodLabel}`
          }
        />
      </dl>

      <div className="mt-7 grid gap-2 sm:grid-cols-3">
        <Button
          variant="secondary"
          onClick={() =>
            downloadFile(
              `${props.bookingId}.ics`,
              calendarInvite({
                id: props.bookingId,
                doctorName: props.doctorName,
                specialty: props.specialty,
                hospital: props.hospital,
                type: props.type,
                date: props.date,
                time: props.time,
              }),
              "text/calendar",
            )
          }
        >
          <CalendarPlus size={16} />
          Add to calendar
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            downloadFile(
              `${props.bookingId}-receipt.txt`,
              receiptText({
                id: props.bookingId,
                doctorName: props.doctorName,
                specialty: props.specialty,
                hospital: props.hospital,
                type: consultationLabel[props.type],
                date: formatLongDate(props.date),
                time: props.time,
                patient: props.patient,
                fee: props.fee,
                method: methodLabel,
              }),
              "text/plain",
            )
          }
        >
          <Download size={16} />
          Download receipt
        </Button>
        <Link
          href="/patient/appointments"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(104deg,var(--color-electric),var(--color-indigo))] px-5 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgb(27_99_255/0.75)] transition-transform hover:-translate-y-0.5"
        >
          <CalendarCheck size={16} />
          View appointments
        </Link>
      </div>

      <p className="mt-6 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
        This is an interactive demonstration. No appointment has been made with a real clinic and
        no payment was processed.
      </p>
    </Card>
  );
}
