"use client";

import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { cx } from "@/lib/format";

const control =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-faint focus:outline-none disabled:bg-mist disabled:text-ink-faint";

function frame(error?: string) {
  return cx(control, error ? "border-coral focus:border-coral" : "hairline focus:border-electric");
}

interface Wrap {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children?: ReactNode;
}

function Shell({
  id,
  label,
  hint,
  error,
  required,
  children,
}: Wrap & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-1.5 text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="text-coral" aria-hidden="true">
            *
          </span>
        )}
        {hint && <span className="ml-auto text-xs font-normal text-ink-faint">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  required,
  ...rest
}: Wrap & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={frame(error)}
        {...rest}
      />
    </Shell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  ...rest
}: Wrap & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cx(frame(error), "resize-none")}
        {...rest}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  children,
  ...rest
}: Wrap & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={frame(error)}
        {...rest}
      >
        {children}
      </select>
    </Shell>
  );
}

/** Segmented radio group used for consultation type, delivery speed, payment. */
export function OptionCards<T extends string>({
  name,
  value,
  onChange,
  options,
  columns = 3,
}: {
  name: string;
  value: T | null;
  onChange: (value: T) => void;
  options: { value: T; label: string; description?: string; icon?: ReactNode }[];
  columns?: 1 | 2 | 3;
}) {
  const cols = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[columns];
  return (
    <div role="radiogroup" className={cx("grid gap-3", cols)}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cx(
              "flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-all duration-200",
              selected
                ? "border-electric bg-[color-mix(in_oklab,var(--color-electric)_6%,white)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-electric)_14%,transparent)]"
                : "hairline bg-white hover:border-[color-mix(in_oklab,var(--color-electric)_40%,transparent)]",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.icon && (
              <span
                className={cx(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors",
                  selected ? "bg-electric text-white" : "bg-ice text-ink-soft",
                )}
              >
                {option.icon}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">{option.label}</span>
              {option.description && (
                <span className="mt-0.5 block text-xs text-ink-soft">{option.description}</span>
              )}
            </span>
            <span
              aria-hidden="true"
              className={cx(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
                selected ? "border-electric bg-electric" : "border-[#c9d3e8]",
              )}
            >
              {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
          </label>
        );
      })}
    </div>
  );
}
