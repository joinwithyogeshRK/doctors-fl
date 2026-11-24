"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { cx } from "@/lib/format";

export interface FaqItem {
  question: string;
  answer: string;
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] overflow-hidden rounded-panel border hairline bg-white">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-mist sm:px-7"
              >
                <span className={cx("text-[1.0625rem] font-semibold", expanded ? "text-electric" : "text-ink")}>
                  {item.question}
                </span>
                <span
                  className={cx(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                    expanded ? "bg-electric text-white" : "bg-ice text-ink-soft",
                  )}
                >
                  {expanded ? <Minus size={15} /> : <Plus size={15} />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 text-[0.9375rem] leading-relaxed text-ink-soft sm:px-7 sm:pr-20">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
