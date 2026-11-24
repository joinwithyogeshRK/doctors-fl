"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Table2 } from "lucide-react";
import { cx } from "@/lib/format";

export interface Legend {
  label: string;
  color: string;
}

/**
 * Shared chart chrome: title, legend (always present for 2+ series),
 * and a table view so identity is never carried by colour alone.
 */
export function ChartFrame({
  title,
  caption,
  legend,
  table,
  children,
  action,
}: {
  title: string;
  caption?: string;
  legend?: Legend[];
  table: { head: string[]; rows: (string | number)[][] };
  children: ReactNode;
  action?: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);

  return (
    <figure className="m-0">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <figcaption>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          {caption && <p className="mt-0.5 text-xs text-ink-faint">{caption}</p>}
        </figcaption>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            onClick={() => setShowTable((s) => !s)}
            aria-pressed={showTable}
            className={cx(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors",
              showTable ? "bg-electric text-white" : "bg-ice text-ink-soft hover:bg-ice-deep",
            )}
          >
            <Table2 size={13} />
            {showTable ? "Chart" : "Table"}
          </button>
        </div>
      </div>

      {legend && legend.length > 1 && (
        <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
          {legend.map((entry) => (
            <li key={entry.label} className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: entry.color }}
                aria-hidden="true"
              />
              {entry.label}
            </li>
          ))}
        </ul>
      )}

      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b hairline text-left text-xs text-ink-faint">
                {table.head.map((cell) => (
                  <th key={cell} scope="col" className="py-2 pr-4 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={cx("py-2 pr-4", j === 0 ? "font-medium text-ink" : "text-ink-soft tnum")}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </figure>
  );
}

export function Tooltip({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-ink px-3 py-2 text-xs whitespace-nowrap text-white shadow-lift"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </div>
  );
}
