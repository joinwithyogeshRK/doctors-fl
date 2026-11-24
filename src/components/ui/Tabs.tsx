"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const groupId = useId();

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Sections"
        className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b hairline px-1"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              id={`${groupId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${groupId}-panel-${item.id}`}
              onClick={() => setActive(item.id)}
              className={cx(
                "relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors",
                selected ? "text-electric" : "text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
              {selected && (
                <motion.span
                  layoutId={`${groupId}-underline`}
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-electric"
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${groupId}-panel-${item.id}`}
          aria-labelledby={`${groupId}-tab-${item.id}`}
          hidden={item.id !== active}
          className="pt-6"
        >
          {item.id === active && item.content}
        </div>
      ))}
    </div>
  );
}
