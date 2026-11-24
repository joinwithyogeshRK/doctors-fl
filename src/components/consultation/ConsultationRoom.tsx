"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  NotebookPen,
  PhoneOff,
  Send,
  Signal,
  Star,
  Video,
  Wifi,
} from "lucide-react";
import { featuredDoctor } from "@/data/doctors";
import { currentPatient } from "@/data/patients";
import { cx, formatFee } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { Stars } from "@/components/ui/Stars";
import { useToast } from "@/components/providers/ToastProvider";

type Phase = "lobby" | "call" | "ended";

interface ChatMessage {
  id: number;
  from: "doctor" | "you";
  text: string;
  at: string;
}

const scriptedReplies = [
  "Thanks — that's helpful. How long has that been going on?",
  "Understood. Any shortness of breath along with it?",
  "I'm noting that down. Let's keep an eye on it over the next two weeks.",
  "I'll put that in the prescription so you have it in writing.",
];

export function ConsultationRoom({ appointmentId }: { appointmentId: string }) {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [panel, setPanel] = useState<"chat" | "notes" | "rx">("chat");
  const [seconds, setSeconds] = useState(0);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: "doctor", text: "Hello Alex — can you hear me clearly?", at: "0:04" },
  ]);
  const nextId = useRef(2);
  const replyIndex = useRef(0);

  // Call timer
  useEffect(() => {
    if (phase !== "call") return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const clock = `${Math.floor(seconds / 60)}:${`${seconds % 60}`.padStart(2, "0")}`;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const id = nextId.current;
    nextId.current += 2;
    setMessages((prev) => [...prev, { id, from: "you", text, at: clock }]);
    setDraft("");
    window.setTimeout(() => {
      const reply = scriptedReplies[replyIndex.current % scriptedReplies.length];
      replyIndex.current += 1;
      setMessages((prev) => [...prev, { id: id + 1, from: "doctor", text: reply, at: clock }]);
    }, 1200);
  };

  /* ---------------- Lobby ---------------- */
  if (phase === "lobby") {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card padded={false} className="overflow-hidden">
          <div className="relative aspect-video bg-[linear-gradient(150deg,#101c3d,#1d1b4b)]">
            {camera ? (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/10 text-2xl font-bold text-white backdrop-blur-sm">
                    {currentPatient.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <p className="mt-4 text-sm text-white/70">Your camera preview</p>
                  <p className="mt-1 text-xs text-white/40">
                    A real deployment would show your webcam here
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center text-white/60">
                  <CameraOff size={32} className="mx-auto" />
                  <p className="mt-3 text-sm">Camera is off</p>
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4">
              <ControlButton
                active={mic}
                onClick={() => setMic((m) => !m)}
                label={mic ? "Mute microphone" : "Unmute microphone"}
                icon={mic ? <Mic size={18} /> : <MicOff size={18} />}
              />
              <ControlButton
                active={camera}
                onClick={() => setCamera((c) => !c)}
                label={camera ? "Turn camera off" : "Turn camera on"}
                icon={camera ? <Camera size={18} /> : <CameraOff size={18} />}
              />
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <h1 className="font-display text-xl font-bold text-ink">Ready to join?</h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              Check your microphone and camera before entering the consultation.
            </p>

            <ul className="mt-5 space-y-2.5">
              <CheckRow
                ok={mic}
                label="Microphone"
                detail={mic ? "Working — input detected" : "Muted"}
                icon={<Mic size={15} />}
              />
              <CheckRow
                ok={camera}
                label="Camera"
                detail={camera ? "Working — preview above" : "Turned off"}
                icon={<Video size={15} />}
              />
              <CheckRow ok label="Internet connection" detail="Strong · 24 Mbps" icon={<Wifi size={15} />} />
            </ul>

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={() => {
                setPhase("call");
                toast("success", "Joined the consultation", featuredDoctor.name);
              }}
            >
              <Video size={18} />
              Join consultation
            </Button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardTitle>Your doctor</CardTitle>
            <div className="flex items-center gap-4">
              <DoctorAvatar doctor={featuredDoctor} size={56} rounded="card" />
              <div className="min-w-0">
                <p className="font-semibold text-ink">{featuredDoctor.name}</p>
                <p className="text-sm text-electric">{featuredDoctor.specialty}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Stars rating={featuredDoctor.rating} size={12} />
                  <span className="text-xs text-ink-faint">{featuredDoctor.rating}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{featuredDoctor.bio}</p>
          </Card>

          <Card>
            <CardTitle>Appointment</CardTitle>
            <dl className="space-y-2.5 text-sm">
              <Row label="Reference" value={appointmentId} />
              <Row label="Type" value="Video consultation" />
              <Row label="Scheduled" value="Today, 4:30 PM" />
              <Row label="Fee" value={`${formatFee(featuredDoctor.consultationFee)} · paid`} />
            </dl>
          </Card>

          <p className="rounded-card bg-mist px-5 py-4 text-xs leading-relaxed text-ink-soft">
            This is a simulated consultation. No camera or microphone is accessed, no call is
            placed, and no doctor is on the other end.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- Ended ---------------- */
  if (phase === "ended") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Card className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
            <CheckCircle2 size={32} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-ink">Consultation completed</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            You spoke with {featuredDoctor.name} for {clock}. A summary and prescription are in
            your account.
          </p>
        </Card>

        <Card>
          <CardTitle>Doctor&rsquo;s notes</CardTitle>
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
            {notes.trim() ||
              "Blood pressure readings reviewed and stable on the current dose. Reported occasional tightness on exertion, no radiation or breathlessness. Advised to continue the home log, reduce added salt and keep to 30 minutes of walking daily."}
          </p>
        </Card>

        <Card>
          <CardTitle>Prescription issued</CardTitle>
          <ul className="space-y-3">
            {[
              { name: "Amlodipine 5 mg", detail: "Once daily, morning · 90 days" },
              { name: "Low Dose Aspirin 75 mg", detail: "Once daily, after dinner · 90 days" },
            ].map((item) => (
              <li key={item.name} className="rounded-card border hairline p-4">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{item.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/patient/prescriptions" size="sm">
              View prescription
            </ButtonLink>
            <ButtonLink href="/pharmacy" variant="secondary" size="sm">
              Order these medicines
            </ButtonLink>
          </div>
        </Card>

        <Card>
          <CardTitle>Follow-up recommended</CardTitle>
          <p className="text-sm leading-relaxed text-ink-soft">
            {featuredDoctor.name} suggests a review in four weeks with your blood pressure log.
          </p>
          <ButtonLink
            href={`/appointments/book?doctor=${featuredDoctor.slug}`}
            variant="secondary"
            size="sm"
            className="mt-4"
          >
            Book the follow-up
          </ButtonLink>
        </Card>

        <Card>
          <CardTitle>How was your consultation?</CardTitle>
          {feedbackSent ? (
            <p className="flex items-center gap-2 rounded-xl bg-[color-mix(in_oklab,var(--color-mint)_10%,white)] px-4 py-3 text-sm text-ink-soft">
              <CheckCircle2 size={16} className="text-mint" />
              Thanks — your feedback helps other patients choose.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this consultation">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    aria-pressed={rating === value}
                    className="rounded p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      strokeWidth={0}
                      className={value <= rating ? "fill-amber" : "fill-[#d8dfee]"}
                    />
                  </button>
                ))}
              </div>
              <Button
                className="mt-4"
                size="sm"
                disabled={rating === 0}
                onClick={() => {
                  setFeedbackSent(true);
                  toast("success", "Feedback sent", "Demo only — nothing was submitted.");
                }}
              >
                Submit feedback
              </Button>
            </>
          )}
        </Card>

        <div className="flex flex-wrap justify-center gap-2 pb-4">
          <ButtonLink href="/patient/dashboard" variant="secondary">
            Back to dashboard
          </ButtonLink>
          <Button variant="ghost" onClick={() => { setPhase("lobby"); setSeconds(0); }}>
            Replay the demo
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- In call ---------------- */
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
      <div className="relative overflow-hidden rounded-panel bg-[linear-gradient(150deg,#0b1430,#1a1842)]">
        {/* Doctor "video" */}
        <div className="relative aspect-video w-full">
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <DoctorAvatar doctor={featuredDoctor} size={96} rounded="card" className="mx-auto ring-4 ring-white/10" />
              <p className="mt-4 font-display text-xl font-semibold text-white">
                {featuredDoctor.name}
              </p>
              <p className="mt-1 text-sm text-white/50">{featuredDoctor.specialty}</p>
              {sharing && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-electric/20 px-3 py-1.5 text-xs font-semibold text-electric-light">
                  <MonitorUp size={13} />
                  You are sharing your screen
                </p>
              )}
            </div>
          </div>

          {/* Status strip */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
              Live · {clock}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
              <Signal size={12} className="text-mint" />
              Excellent connection
            </span>
          </div>

          {/* Self view */}
          <div className="absolute right-4 bottom-4 h-24 w-36 overflow-hidden rounded-xl border border-white/15 bg-[#141a35] sm:h-28 sm:w-44">
            <div className="grid h-full place-items-center">
              {camera ? (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/12 text-xs font-bold text-white">
                  {currentPatient.name.split(" ").map((p) => p[0]).join("")}
                </span>
              ) : (
                <CameraOff size={20} className="text-white/40" />
              )}
            </div>
            <span className="absolute bottom-1.5 left-2 text-[0.625rem] text-white/60">You</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-4">
          <ControlButton
            active={mic}
            onClick={() => setMic((m) => !m)}
            label={mic ? "Mute" : "Unmute"}
            icon={mic ? <Mic size={18} /> : <MicOff size={18} />}
          />
          <ControlButton
            active={camera}
            onClick={() => setCamera((c) => !c)}
            label={camera ? "Turn camera off" : "Turn camera on"}
            icon={camera ? <Camera size={18} /> : <CameraOff size={18} />}
          />
          <ControlButton
            active={sharing}
            activeTone="electric"
            onClick={() => {
              setSharing((s) => !s);
              toast("info", sharing ? "Stopped sharing" : "Screen sharing started");
            }}
            label={sharing ? "Stop sharing" : "Share screen"}
            icon={<MonitorUp size={18} />}
          />
          <button
            type="button"
            onClick={() => {
              setPhase("ended");
              toast("info", "Call ended", `Duration ${clock}`);
            }}
            aria-label="End call"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-coral px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <PhoneOff size={18} />
            End call
          </button>
        </div>
      </div>

      {/* Side panel */}
      <div className="flex h-[32rem] flex-col overflow-hidden rounded-panel border hairline bg-white lg:h-auto">
        <div className="flex border-b hairline">
          {([
            { id: "chat", label: "Chat", icon: MessageSquare },
            { id: "notes", label: "Notes", icon: NotebookPen },
            { id: "rx", label: "Prescription", icon: ClipboardList },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPanel(tab.id)}
                aria-pressed={panel === tab.id}
                className={cx(
                  "relative flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors",
                  panel === tab.id ? "text-electric" : "text-ink-soft hover:text-ink",
                )}
              >
                <Icon size={14} />
                {tab.label}
                {panel === tab.id && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-electric" />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={panel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            {panel === "chat" && (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto bg-mist p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cx("flex", message.from === "you" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cx(
                          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                          message.from === "you"
                            ? "rounded-br-sm bg-electric text-white"
                            : "rounded-bl-sm bg-white text-ink shadow-soft",
                        )}
                      >
                        {message.text}
                        <span
                          className={cx(
                            "mt-1 block text-[0.625rem]",
                            message.from === "you" ? "text-white/60" : "text-ink-faint",
                          )}
                        >
                          {message.at}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="flex gap-2 border-t hairline p-3"
                >
                  <label htmlFor="call-chat" className="sr-only">
                    Message
                  </label>
                  <input
                    id="call-chat"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message"
                    className="min-w-0 flex-1 rounded-full border hairline bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-electric text-white disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}

            {panel === "notes" && (
              <div className="flex min-h-0 flex-1 flex-col p-4">
                <p className="mb-2 text-xs text-ink-faint">
                  Notes are visible to the doctor only and attach to the consultation record.
                </p>
                <label htmlFor="call-notes" className="sr-only">
                  Consultation notes
                </label>
                <textarea
                  id="call-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Presenting complaint, examination findings, plan…"
                  className="min-h-0 flex-1 resize-none rounded-xl border hairline bg-white p-3.5 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none"
                />
              </div>
            )}

            {panel === "rx" && (
              <div className="flex-1 overflow-y-auto p-4">
                <p className="mb-3 text-xs text-ink-faint">
                  Draft prescription for this consultation.
                </p>
                <ul className="space-y-2.5">
                  {[
                    { name: "Amlodipine", detail: "5 mg · once daily · 90 days" },
                    { name: "Low Dose Aspirin", detail: "75 mg · once daily · 90 days" },
                  ].map((item) => (
                    <li key={item.name} className="rounded-card border hairline p-3.5">
                      <p className="text-sm font-semibold text-ink">{item.name}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">{item.detail}</p>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/doctor/prescriptions"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border hairline bg-white text-sm font-semibold text-ink transition-colors hover:border-electric hover:text-electric"
                >
                  Open the full builder
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  onClick,
  label,
  icon,
  activeTone = "neutral",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  activeTone?: "neutral" | "electric";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        "grid h-12 w-12 place-items-center rounded-full transition-colors",
        active && activeTone === "neutral" && "bg-white/14 text-white hover:bg-white/22",
        active && activeTone === "electric" && "bg-electric text-white",
        !active && "bg-coral/90 text-white hover:bg-coral",
      )}
    >
      {icon}
    </button>
  );
}

function CheckRow({
  ok,
  label,
  detail,
  icon,
}: {
  ok: boolean;
  label: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3">
      <span
        className={cx(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
          ok ? "bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint" : "bg-ice text-ink-faint",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-ink-faint">{detail}</span>
      </span>
      {ok && <CheckCircle2 size={16} className="shrink-0 text-mint" />}
    </li>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
