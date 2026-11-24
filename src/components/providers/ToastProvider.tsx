"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  body?: string;
}

interface ToastApi {
  toast: (tone: ToastTone, title: string, body?: string) => void;
}

const ToastContext = createContext<ToastApi>({ toast: () => {} });

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
const tones = {
  success: "text-mint",
  error: "text-coral",
  info: "text-electric",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (tone: ToastTone, title: string, body?: string) => {
      const id = nextId.current;
      nextId.current += 1;
      setItems((prev) => [...prev.slice(-2), { id, tone, title, body }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = icons[item.tone];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="glass pointer-events-auto flex items-start gap-3 rounded-card p-4"
              >
                <Icon size={18} className={`mt-0.5 shrink-0 ${tones[item.tone]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  {item.body && <p className="mt-0.5 text-xs text-ink-soft">{item.body}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss"
                  className="-mt-1 -mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ice hover:text-ink"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
