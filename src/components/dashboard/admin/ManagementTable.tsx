"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";
import { Card, EmptyState, PageHeader } from "@/components/ui/Surfaces";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
  hideBelow?: "sm" | "md" | "lg";
}

export function ManagementTable<T extends { id: string }>({
  title,
  lede,
  action,
  rows,
  columns,
  searchKeys,
  filters,
  emptyTitle,
  emptyBody,
}: {
  title: string;
  lede: string;
  action?: ReactNode;
  rows: T[];
  columns: Column<T>[];
  searchKeys: (row: T) => string;
  filters?: { label: string; test: (row: T) => boolean }[];
  emptyTitle: string;
  emptyBody: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const active = filters?.find((f) => f.label === filter);
    return rows.filter((row) => {
      if (active && !active.test(row)) return false;
      if (!q) return true;
      return searchKeys(row).toLowerCase().includes(q);
    });
  }, [rows, query, filter, filters, searchKeys]);

  const hide = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title={title} lede={lede} action={action} />

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}`}
            aria-label={`Search ${title}`}
            className="h-11 w-full rounded-full border hairline bg-white pr-4 pl-9 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none"
          />
        </div>

        {filters && filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <SlidersHorizontal size={14} className="mr-0.5 text-ink-faint" />
            {["All", ...filters.map((f) => f.label)].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(label)}
                aria-pressed={filter === label}
                className={cx(
                  "rounded-chip px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === label ? "bg-electric text-white" : "bg-white text-ink-soft hover:bg-ice",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-ink-soft" role="status" aria-live="polite">
        <span className="font-semibold text-ink tnum">{visible.length}</span> of {rows.length}
      </p>

      {visible.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={<Search size={22} />} title={emptyTitle} body={emptyBody} />
        </div>
      ) : (
        <Card className="mt-4 overflow-hidden" padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b hairline bg-mist text-left text-xs text-ink-faint">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={cx(
                        "px-5 py-3 font-semibold whitespace-nowrap",
                        column.align === "right" && "text-right",
                        column.hideBelow && hide[column.hideBelow],
                      )}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
                {visible.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-mist">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cx(
                          "px-5 py-4 align-middle",
                          column.align === "right" && "text-right",
                          column.hideBelow && hide[column.hideBelow],
                        )}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
