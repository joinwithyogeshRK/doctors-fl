"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import { medicineCategories, medicines } from "@/data/medicines";
import { cx } from "@/lib/format";
import { MedicineCard } from "@/components/pharmacy/MedicineCard";
import { QuickView } from "@/components/pharmacy/QuickView";
import { EmptyState } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import type { Medicine } from "@/types";

type Sort = "relevance" | "price-low" | "price-high" | "rating" | "discount";

const sorts: { id: Sort; label: string }[] = [
  { id: "relevance", label: "Most relevant" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
  { id: "rating", label: "Best rated" },
  { id: "discount", label: "Biggest discount" },
];

export function PharmacyBrowser({ store }: { store: "pharmacy" | "wellness" }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [sort, setSort] = useState<Sort>("relevance");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOtc, setOnlyOtc] = useState(false);
  const [quickView, setQuickView] = useState<Medicine | null>(null);

  const pool = useMemo(() => medicines.filter((m) => m.store === store), [store]);
  const categories = useMemo(
    () => medicineCategories.filter((c) => pool.some((m) => m.category === c.slug)),
    [pool],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = pool.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (onlyInStock && !item.inStock) return false;
      if (onlyOtc && item.prescriptionRequired) return false;
      if (!q) return true;
      return [item.name, item.brand, item.description, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    list = [...list];
    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
        break;
      default:
        list.sort((a, b) => Number(b.inStock) - Number(a.inStock) || b.reviewCount - a.reviewCount);
    }
    return list;
  }, [pool, query, category, sort, onlyInStock, onlyOtc]);

  return (
    <div>
      {/* Search and sort */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              store === "pharmacy"
                ? "Search medicines, brands or symptoms"
                : "Search monitors, supplements and devices"
            }
            aria-label="Search products"
            className="h-13 w-full rounded-full border hairline bg-white pr-4 pl-11 text-sm text-ink shadow-soft placeholder:text-ink-faint focus:border-electric focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort products"
          className="h-13 rounded-full border hairline bg-white px-4 text-sm font-medium text-ink shadow-soft focus:border-electric focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="no-scrollbar mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <CategoryChip active={category === "all"} onClick={() => setCategory("all")} label="All" count={pool.length} />
        {categories.map((c) => (
          <CategoryChip
            key={c.slug}
            active={category === c.slug}
            onClick={() => setCategory(c.slug)}
            label={c.name}
            count={pool.filter((m) => m.category === c.slug).length}
          />
        ))}
      </div>

      {/* Quick filters */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <SlidersHorizontal size={14} />
          Filters
        </span>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-electric)]"
          />
          In stock only
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={onlyOtc}
            onChange={(e) => setOnlyOtc(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-electric)]"
          />
          No prescription needed
        </label>
        <span className="ml-auto text-sm text-ink-soft" role="status" aria-live="polite">
          <span className="font-semibold text-ink tnum">{results.length}</span> products
        </span>
      </div>

      {results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<PackageSearch size={22} />}
            title="Nothing matches that search"
            body="Try a brand name, a symptom like 'fever', or clear the category filter."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setOnlyInStock(false);
                  setOnlyOtc(false);
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((item) => (
            <MedicineCard key={item.id} item={item} onQuickView={setQuickView} />
          ))}
        </div>
      )}

      <QuickView item={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "shrink-0 rounded-chip px-4 py-2.5 text-sm font-semibold transition-colors",
        active ? "bg-electric text-white" : "bg-white text-ink-soft shadow-soft hover:bg-ice",
      )}
    >
      {label}
      <span className={cx("ml-1.5 text-xs tnum", active ? "text-white/70" : "text-ink-faint")}>
        {count}
      </span>
    </button>
  );
}
