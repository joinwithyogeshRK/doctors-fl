"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Activity, CalendarCheck, HeartPulse } from "lucide-react";
import type { PointerEvent } from "react";
import { EcgLine } from "@/components/animations/EcgLine";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The hero composition: doctor cutout anchored to a light plinth, a
 * holographic heart drifting above it, and three readings floating in
 * front on glass. Pointer parallax gives the layers depth; everything
 * settles to a static arrangement under prefers-reduced-motion.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 24, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // Each layer moves a different amount — nearest moves most.
  const backX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const backY = useTransform(sy, [-0.5, 0.5], [-6, 6]);
  const midX = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const midY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const frontX = useTransform(sx, [-0.5, 0.5], [-34, 34]);
  const frontY = useTransform(sy, [-0.5, 0.5], [-20, 20]);

  const back = { x: backX, y: backY };
  const mid = { x: midX, y: midY };
  const front = { x: frontX, y: frontY };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  const float = (delay: number, distance = 10) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -distance, 0] },
          transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] lg:aspect-[5/6] lg:max-w-none"
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {/* Plinth: the glow the doctor stands on */}
      <div
        className="absolute inset-x-[6%] bottom-[4%] h-[62%] rounded-[50%] blur-2xl"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 60%, rgb(27 99 255 / 0.3), rgb(122 77 255 / 0.14) 55%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      {/* Concentric rings behind the figure */}
      <motion.div style={back} className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-[12%] left-1/2 aspect-square w-[78%] -translate-x-1/2 rounded-full border border-electric/12" />
        <div className="absolute top-[20%] left-1/2 aspect-square w-[56%] -translate-x-1/2 rounded-full border border-violet/14" />
      </motion.div>

      {/* Protective-shield object, sitting furthest back */}
      <motion.div
        style={back}
        className="absolute top-[30%] -left-[2%] w-[16%] max-w-[86px] opacity-85 sm:w-[14%]"
        {...float(1.4, 8)}
      >
        <Image
          src="/assets/healthcare/hero/medical-shield.png"
          alt=""
          width={596}
          height={900}
          className="h-auto w-full drop-shadow-[0_18px_28px_rgb(27_99_255/0.22)]"
        />
      </motion.div>

      {/* The doctor */}
      <motion.div
        style={mid}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease }}
        className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center"
      >
        <Image
          src="/assets/healthcare/hero/doctor.png"
          alt="A doctor at Meridian Health"
          width={427}
          height={1263}
          priority
          sizes="(max-width: 1024px) 60vw, 30vw"
          className="h-[88%] w-auto object-contain drop-shadow-[0_30px_50px_rgb(10_26_60/0.18)]"
        />
      </motion.div>

      {/* Holographic heart */}
      <motion.div
        style={front}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease }}
        className="absolute top-[3%] right-[1%] w-[31%] max-w-[190px]"
      >
        <motion.div {...float(0, 14)}>
          <Image
            src="/assets/healthcare/hero/holographic-heart.png"
            alt=""
            width={788}
            height={927}
            sizes="(max-width: 1024px) 32vw, 190px"
            className="h-auto w-full drop-shadow-[0_24px_44px_rgb(122_77_255/0.38)]"
          />
        </motion.div>
      </motion.div>

      {/* Reading: health score */}
      <motion.div
        style={front}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: -24, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75, ease }}
        className="absolute top-[11%] left-0 w-[52%] max-w-[13.5rem]"
      >
        <motion.div className="glass rounded-card p-3.5" {...float(0.8, 7)}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-mint)_16%,white)] text-mint">
              <Activity size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-medium text-ink-faint">Health score</p>
              <p className="font-display text-lg leading-tight font-semibold text-ink">
                86<span className="text-sm font-medium text-ink-faint">/100</span>
              </p>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ice-deep">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-mint),var(--color-electric))]"
              initial={{ width: reduce ? "86%" : 0 }}
              animate={{ width: "86%" }}
              transition={{ duration: 1.1, delay: 1, ease }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Reading: heart rate */}
      <motion.div
        style={front}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease }}
        className="absolute bottom-[18%] -left-[2%] w-[50%] max-w-[12.5rem]"
      >
        <motion.div className="glass rounded-card p-3.5" {...float(2.1, 9)}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium text-ink-faint">
              <HeartPulse size={13} className="text-coral" />
              Heart rate
            </span>
            <span className="font-display text-base font-semibold text-ink">
              72<span className="ml-0.5 text-[0.625rem] font-medium text-ink-faint">bpm</span>
            </span>
          </div>
          <EcgLine className="mt-1.5 h-7 w-full" stroke="var(--color-coral)" speed={2.6} />
        </motion.div>
      </motion.div>

      {/* Reading: next appointment */}
      <motion.div
        style={mid}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 1.05, ease }}
        className="absolute right-0 bottom-[8%] w-[56%] max-w-[14.5rem]"
      >
        <motion.div className="glass rounded-card p-3.5" {...float(3.4, 8)}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-electric)_12%,white)] text-electric">
              <CalendarCheck size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-[0.6875rem] font-medium text-ink-faint">Next available</p>
              <p className="truncate text-[0.8125rem] font-semibold text-ink">Today, 4:30 PM</p>
            </div>
          </div>
          <p className="mt-2 truncate border-t hairline pt-2 text-[0.6875rem] text-ink-soft">
            Dr. Ananya Rao · Cardiology
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
