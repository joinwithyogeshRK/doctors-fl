"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useScrolled } from "@/hooks/useScrolled";
import { LiveChat } from "@/components/layout/LiveChat";

export function FloatingWidgets() {
  const scrolled = useScrolled(700);

  return (
    <>
      <AnimatePresence>
        {scrolled && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="glass fixed right-4 bottom-21 z-[74] grid h-11 w-11 place-items-center rounded-full text-ink transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-23"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <LiveChat />
    </>
  );
}
