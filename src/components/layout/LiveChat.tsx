"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageCircle, Minus, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";

interface Message {
  id: number;
  from: "agent" | "you";
  text: string;
}

const quickReplies = [
  "Book an appointment",
  "Track my order",
  "Talk to a doctor",
  "Pharmacy hours",
];

const replies: Record<string, string> = {
  "book an appointment":
    "Happy to help. You can book in about a minute from the Book appointment page — choose a doctor, a date and a slot. Would you like me to open it?",
  "track my order":
    "Your most recent order, MH-ORD-48217, is out for delivery and should arrive by 2:45 PM. You can follow it live on the tracking page.",
  "talk to a doctor":
    "Several consultants have video slots today, including General Medicine and Psychiatry. The Find a doctor page lets you filter by Available today.",
  "pharmacy hours":
    "Our pharmacy desk is open 8 AM to 10 PM every day, and online orders are accepted around the clock. Express delivery runs until 9 PM.",
};

const fallback =
  "Thanks for asking. In a live deployment this would reach the support desk. For now, try one of the quick replies, or call +91 80 0000 0000.";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "agent",
      text: "Hello. I'm Maya from the Meridian Health support desk. What can I help you with today?",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(2);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;

    const id = nextId.current;
    nextId.current += 2;
    setMessages((prev) => [...prev, { id, from: "you", text: value }]);
    setDraft("");
    setTyping(true);

    window.setTimeout(() => {
      const answer = replies[value.toLowerCase()] ?? fallback;
      setTyping(false);
      setMessages((prev) => [...prev, { id: id + 1, from: "agent", text: answer }]);
    }, 1100);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Support chat"
            className="fixed right-4 bottom-20 z-[75] flex h-[min(30rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-panel bg-white shadow-float sm:right-6 sm:bottom-24"
          >
            <header className="flex items-center gap-3 bg-[linear-gradient(118deg,var(--color-electric),var(--color-indigo))] px-4 py-3.5 text-white">
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/18 text-sm font-semibold">
                M
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-mint ring-2 ring-[#2a46c8]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Maya · Support</span>
                <span className="block text-[0.6875rem] text-white/75">
                  Typically replies in a minute
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Minimise chat"
                className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X size={16} />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-mist p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cx("flex", message.from === "you" ? "justify-end" : "justify-start")}
                >
                  <p
                    className={cx(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      message.from === "you"
                        ? "rounded-br-sm bg-electric text-white"
                        : "rounded-bl-sm bg-white text-ink shadow-soft",
                    )}
                  >
                    {message.text}
                  </p>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <span className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-soft">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
                        style={{ animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t hairline bg-white p-3">
              <div className="no-scrollbar -mx-1 mb-2.5 flex gap-1.5 overflow-x-auto px-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => send(reply)}
                    className="shrink-0 rounded-chip bg-ice px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-electric hover:text-white"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(draft);
                }}
                className="flex gap-2"
              >
                <label htmlFor="chat-input" className="sr-only">
                  Message
                </label>
                <input
                  id="chat-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message"
                  className="min-w-0 flex-1 rounded-full border hairline bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!draft.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-electric text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-[75] grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(118deg,var(--color-electric),var(--color-indigo))] text-white shadow-[0_14px_32px_-12px_rgb(27_99_255/0.9)] transition-transform hover:-translate-y-1 sm:right-6 sm:bottom-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.7 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-mint ring-2 ring-white" />
        )}
      </button>
    </>
  );
}
