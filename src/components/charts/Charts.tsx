"use client";

import { useState } from "react";
import { ChartFrame, Tooltip } from "@/components/charts/ChartFrame";
import { GRID, OTHER, SEQUENTIAL, seriesColor } from "@/components/charts/palette";
import { cx } from "@/lib/format";

/* ------------------------------------------------------------------ */
/* Grouped bars — magnitude across a category, split by 2+ series      */
/* ------------------------------------------------------------------ */

export function GroupedBars({
  title,
  caption,
  data,
  series,
  format = (n) => n.toLocaleString("en-IN"),
}: {
  title: string;
  caption?: string;
  data: Record<string, string | number>[];
  series: { key: string; label: string }[];
  format?: (value: number) => string;
}) {
  const [hover, setHover] = useState<{ group: number; series: number } | null>(null);

  const max = Math.max(
    ...data.flatMap((row) => series.map((s) => Number(row[s.key]) || 0)),
  );
  const ceiling = niceCeiling(max);

  return (
    <ChartFrame
      title={title}
      caption={caption}
      legend={series.map((s, i) => ({ label: s.label, color: seriesColor(i) }))}
      table={{
        head: ["Period", ...series.map((s) => s.label)],
        rows: data.map((row) => [
          String(row.month ?? row.label ?? ""),
          ...series.map((s) => format(Number(row[s.key]) || 0)),
        ]),
      }}
    >
      <div className="relative">
        <div className="flex h-56 items-end gap-3">
          {/* Y grid */}
          <div className="relative flex h-full w-10 shrink-0 flex-col justify-between py-0 text-right">
            {[1, 0.5, 0].map((t) => (
              <span key={t} className="text-[0.625rem] text-ink-faint tnum">
                {format(Math.round(ceiling * t))}
              </span>
            ))}
          </div>

          <div className="relative flex h-full flex-1 items-end justify-between gap-2">
            {[0, 0.5, 1].map((t) => (
              <span
                key={t}
                aria-hidden="true"
                className="absolute inset-x-0 h-px"
                style={{ bottom: `${t * 100}%`, background: GRID }}
              />
            ))}

            {data.map((row, g) => (
              <div key={g} className="relative flex h-full flex-1 items-end justify-center gap-0.5">
                {series.map((s, i) => {
                  const value = Number(row[s.key]) || 0;
                  const height = (value / ceiling) * 100;
                  const active = hover?.group === g && hover?.series === i;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onMouseEnter={() => setHover({ group: g, series: i })}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover({ group: g, series: i })}
                      onBlur={() => setHover(null)}
                      aria-label={`${row.month ?? ""} ${s.label}: ${format(value)}`}
                      className="group relative flex h-full w-full max-w-7 items-end"
                    >
                      <span
                        className={cx(
                          "w-full rounded-t-[4px] transition-opacity duration-150",
                          hover && !active && "opacity-45",
                        )}
                        style={{
                          height: `${height}%`,
                          background: seriesColor(i),
                          outline: "2px solid var(--color-white)",
                          outlineOffset: "-1px",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            ))}

            {hover && (
              <Tooltip
                x={((hover.group + 0.5) / data.length) * 100}
                y={100 - (Number(data[hover.group][series[hover.series].key]) / ceiling) * 100 - 4}
              >
                <span className="font-semibold">{String(data[hover.group].month ?? "")}</span>
                {" · "}
                {series[hover.series].label}{" "}
                <span className="font-semibold tnum">
                  {format(Number(data[hover.group][series[hover.series].key]))}
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <span className="w-10 shrink-0" />
          <div className="flex flex-1 justify-between gap-2">
            {data.map((row, i) => (
              <span key={i} className="flex-1 text-center text-[0.625rem] text-ink-faint">
                {String(row.month ?? row.label ?? "")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Trend area — one series over time, with crosshair                    */
/* ------------------------------------------------------------------ */

export function TrendArea({
  title,
  caption,
  data,
  valueKey,
  labelKey = "month",
  format = (n) => n.toLocaleString("en-IN"),
  color = seriesColor(0),
}: {
  title: string;
  caption?: string;
  data: Record<string, string | number>[];
  valueKey: string;
  labelKey?: string;
  format?: (value: number) => string;
  color?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = niceCeiling(Math.max(...values));
  const min = 0;
  const width = 100;
  const height = 100;

  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * width,
    y: height - ((v - min) / (max - min)) * height,
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gradientId = `grad-${valueKey}`;

  return (
    <ChartFrame
      title={title}
      caption={caption}
      table={{
        head: ["Period", title],
        rows: data.map((row) => [String(row[labelKey]), format(Number(row[valueKey]))]),
      }}
    >
      <div
        className="relative"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          setHover(Math.max(0, Math.min(values.length - 1, Math.round(ratio * (values.length - 1)))));
        }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-52 w-full" role="img" aria-label={title}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line key={t} x1="0" x2={width} y1={t * height} y2={t * height} stroke={GRID} strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          ))}

          <path d={area} fill={`url(#${gradientId})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

          {hover !== null && (
            <>
              <line
                x1={points[hover].x}
                x2={points[hover].x}
                y1="0"
                y2={height}
                stroke={color}
                strokeOpacity="0.35"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={points[hover].x}
                cy={points[hover].y}
                r="5"
                fill={color}
                stroke="var(--color-white)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>

        {hover !== null && (
          <Tooltip x={(hover / (values.length - 1)) * 100} y={(points[hover].y / height) * 100 - 6}>
            <span className="font-semibold">{String(data[hover][labelKey])}</span>{" "}
            <span className="tnum">{format(values[hover])}</span>
          </Tooltip>
        )}

        <div className="mt-2 flex justify-between">
          {data.map((row, i) => (
            <span key={i} className="text-[0.625rem] text-ink-faint">
              {String(row[labelKey])}
            </span>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Donut — part-to-whole                                                */
/* ------------------------------------------------------------------ */

export function Donut({
  title,
  caption,
  data,
}: {
  title: string;
  caption?: string;
  data: { name: string; share: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.share, 0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const arcs = data.map((d, i) => {
    const preceding = data
      .slice(0, i)
      .reduce((sum, prev) => sum + prev.share / total, 0);
    return {
      ...d,
      color: d.name.toLowerCase().startsWith("other") ? OTHER : seriesColor(i),
      dash: (d.share / total) * circumference,
      offset: preceding * circumference,
    };
  });

  return (
    <ChartFrame
      title={title}
      caption={caption}
      legend={arcs.map((a) => ({ label: a.name, color: a.color }))}
      table={{
        head: ["Specialty", "Share"],
        rows: data.map((d) => [d.name, `${d.share}%`]),
      }}
    >
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative shrink-0">
          <svg viewBox="0 0 100 100" className="h-44 w-44 -rotate-90" role="img" aria-label={title}>
            {arcs.map((arc, i) => (
              <circle
                key={arc.name}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={hover === i ? 15 : 13}
                strokeDasharray={`${Math.max(0, arc.dash - 2)} ${circumference - arc.dash + 2}`}
                strokeDashoffset={-arc.offset}
                strokeLinecap="butt"
                className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                style={{ opacity: hover === null || hover === i ? 1 : 0.45 }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            {hover === null ? (
              <div>
                <p className="font-display text-2xl font-bold text-ink tnum">{data.length}</p>
                <p className="text-[0.625rem] text-ink-faint">categories</p>
              </div>
            ) : (
              <div>
                <p className="font-display text-2xl font-bold text-ink tnum">{data[hover].share}%</p>
                <p className="max-w-20 text-[0.625rem] leading-tight text-ink-faint">{data[hover].name}</p>
              </div>
            )}
          </div>
        </div>

        <ul className="min-w-[10rem] flex-1 space-y-2">
          {arcs.map((arc, i) => (
            <li
              key={arc.name}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="flex items-center gap-2.5 text-sm"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: arc.color }} />
              <span className="min-w-0 flex-1 truncate text-ink-soft">{arc.name}</span>
              <span className="shrink-0 font-semibold text-ink tnum">{arc.share}%</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Ranked horizontal bars — magnitude by entity                         */
/* ------------------------------------------------------------------ */

export function RankedBars({
  title,
  caption,
  data,
  format = (n) => n.toLocaleString("en-IN"),
}: {
  title: string;
  caption?: string;
  data: { label: string; value: number; sub?: string }[];
  format?: (value: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <ChartFrame
      title={title}
      caption={caption}
      table={{ head: ["Name", "Value"], rows: data.map((d) => [d.label, format(d.value)]) }}
    >
      <ul className="space-y-3.5">
        {data.map((row, i) => (
          <li key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-medium text-ink">{row.label}</span>
              <span className="shrink-0 text-sm font-semibold text-ink tnum">{format(row.value)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ice">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${(row.value / max) * 100}%`,
                  background: SEQUENTIAL[Math.min(SEQUENTIAL.length - 1, 5 - Math.floor((i / data.length) * 3))],
                }}
              />
            </div>
            {row.sub && <p className="mt-1 text-xs text-ink-faint">{row.sub}</p>}
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}

function niceCeiling(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}
