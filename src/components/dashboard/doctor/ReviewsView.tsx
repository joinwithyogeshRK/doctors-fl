"use client";

import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { featuredDoctor } from "@/data/doctors";
import { doctorProfile } from "@/data/doctorProfiles";
import { cx } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { useToast } from "@/components/providers/ToastProvider";

const profile = doctorProfile(featuredDoctor);
const breakdown = [
  { star: 5, share: 82 },
  { star: 4, share: 13 },
  { star: 3, share: 3 },
  { star: 2, share: 1 },
  { star: 1, share: 1 },
];

export function ReviewsView() {
  const { toast } = useToast();
  const [replied, setReplied] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "5" | "4">("all");

  const visible =
    filter === "all" ? profile.reviews : profile.reviews.filter((r) => String(r.rating) === filter);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Reviews" lede="What your patients say, and your replies to them." />

      <Card className="mt-7">
        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="font-display text-4xl font-bold text-ink">{featuredDoctor.rating}</p>
            <Stars rating={featuredDoctor.rating} size={15} className="mt-1.5" />
            <p className="mt-1.5 text-xs text-ink-faint">
              {featuredDoctor.reviewCount} verified reviews
            </p>
          </div>
          <div className="min-w-[13rem] flex-1 space-y-1.5">
            {breakdown.map((row) => (
              <div key={row.star} className="flex items-center gap-2.5 text-xs text-ink-faint">
                <span className="w-3 tnum">{row.star}</span>
                <Star size={11} strokeWidth={0} className="fill-amber" />
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ice">
                  <span className="block h-full rounded-full bg-amber" style={{ width: `${row.share}%` }} />
                </span>
                <span className="w-8 text-right tnum">{row.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {(["all", "5", "4"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cx(
              "rounded-chip px-3.5 py-2 text-xs font-semibold transition-colors",
              filter === f ? "bg-electric text-white" : "bg-white text-ink-soft hover:bg-ice",
            )}
          >
            {f === "all" ? "All reviews" : `${f} stars`}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {visible.map((review) => (
          <Card key={review.id}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-sm font-semibold text-white">
                {review.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{review.name}</p>
                <p className="text-xs text-ink-faint">
                  {review.type} consultation · {review.date}
                </p>
              </div>
              <Stars rating={review.rating} size={14} />
            </div>

            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{review.body}</p>

            {replied.has(review.id) ? (
              <div className="mt-4 rounded-card bg-mist p-4">
                <p className="text-xs font-semibold text-electric">Your reply</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{draft[review.id]}</p>
              </div>
            ) : (
              <div className="mt-4">
                <label htmlFor={`reply-${review.id}`} className="sr-only">
                  Reply to {review.name}
                </label>
                <textarea
                  id={`reply-${review.id}`}
                  rows={2}
                  value={draft[review.id] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [review.id]: e.target.value })}
                  placeholder="Write a short reply…"
                  className="w-full resize-none rounded-xl border hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none"
                />
                <Button
                  size="sm"
                  className="mt-2"
                  disabled={!(draft[review.id] ?? "").trim()}
                  onClick={() => {
                    setReplied((prev) => new Set(prev).add(review.id));
                    toast("success", "Reply posted", "Visible on your public profile.");
                  }}
                >
                  <MessageSquare size={14} />
                  Post reply
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
