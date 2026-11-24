"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { doctors } from "@/data/doctors";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/format";

interface Errors {
  name?: string;
  rating?: string;
  review?: string;
}

export function ReviewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [doctorSlug, setDoctorSlug] = useState(doctors[0].slug);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Reset a moment after closing so the form does not flicker on the way out.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setName("");
      setRating(0);
      setReview("");
      setErrors({});
      setStatus("idle");
    }, 250);
    return () => clearTimeout(t);
  }, [open]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter the name you want shown with the review.";
    if (rating === 0) next.rating = "Choose a rating from one to five stars.";
    if (review.trim().length < 20) next.review = "Reviews need at least 20 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    // Demo only — nothing leaves the browser.
    setTimeout(() => setStatus("sent"), 900);
  };

  const field =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-electric focus:outline-none";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-panel bg-white p-6 shadow-float sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice"
            >
              <X size={18} />
            </button>

            {status === "sent" ? (
              <div className="py-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
                  <CheckCircle2 size={28} />
                </span>
                <h2 id="review-title" className="mt-5 text-xl font-semibold text-ink">
                  Thanks for sharing
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                  Your review would normally go to the practice for moderation before it appears.
                  This is an interactive demo, so nothing was submitted.
                </p>
                <Button onClick={onClose} className="mt-6">
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 id="review-title" className="pr-10 text-xl font-semibold text-ink">
                  Share your experience
                </h2>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Tell other patients what the visit was like.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="rv-name" className="mb-1.5 block text-sm font-medium text-ink">
                      Your name
                    </label>
                    <input
                      id="rv-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Shruti Kulkarni"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "rv-name-err" : undefined}
                      className={cx(field, errors.name ? "border-coral" : "hairline")}
                    />
                    {errors.name && (
                      <p id="rv-name-err" className="mt-1.5 text-xs text-coral">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rv-doctor" className="mb-1.5 block text-sm font-medium text-ink">
                      Which doctor did you see?
                    </label>
                    <select
                      id="rv-doctor"
                      value={doctorSlug}
                      onChange={(e) => setDoctorSlug(e.target.value)}
                      className={cx(field, "hairline")}
                    >
                      {doctors.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.name} — {d.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <fieldset>
                    <legend className="mb-1.5 text-sm font-medium text-ink">Rating</legend>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          onMouseEnter={() => setHovered(value)}
                          aria-label={`${value} star${value > 1 ? "s" : ""}`}
                          aria-pressed={rating === value}
                          className="rounded p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            size={26}
                            strokeWidth={0}
                            className={
                              value <= (hovered || rating) ? "fill-amber" : "fill-[#d8dfee]"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && <p className="mt-1.5 text-xs text-coral">{errors.rating}</p>}
                  </fieldset>

                  <div>
                    <label htmlFor="rv-text" className="mb-1.5 block text-sm font-medium text-ink">
                      Your review
                    </label>
                    <textarea
                      id="rv-text"
                      rows={4}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="What stood out about the consultation?"
                      aria-invalid={Boolean(errors.review)}
                      className={cx(field, "resize-none", errors.review ? "border-coral" : "hairline")}
                    />
                    <div className="mt-1.5 flex justify-between text-xs">
                      <span className="text-coral">{errors.review}</span>
                      <span className="text-ink-faint">{review.trim().length}/20</span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 rounded-xl bg-ice px-4 py-3 text-xs leading-relaxed text-ink-soft">
                  Demonstration only. Nothing you type here is sent or stored.
                </p>

                <div className="mt-5 flex gap-2">
                  <Button type="submit" disabled={status === "sending"} className="flex-1">
                    {status === "sending" ? "Sending…" : "Post review"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
