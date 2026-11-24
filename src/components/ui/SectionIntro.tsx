import type { ReactNode } from "react";
import { cx } from "@/lib/format";
import { Reveal } from "@/components/animations/Reveal";

interface SectionIntroProps {
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionIntro({
  title,
  lede,
  action,
  align = "left",
  tone = "light",
  className,
}: SectionIntroProps) {
  return (
    <Reveal
      className={cx(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cx("max-w-2xl", align === "center" && "mx-auto")}>
        <h2
          className={cx(
            "text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-[2.75rem]",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {lede && (
          <p
            className={cx(
              "mt-4 max-w-xl text-base leading-relaxed",
              tone === "dark" ? "text-white/70" : "text-ink-soft",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
