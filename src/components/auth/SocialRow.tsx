"use client";

import { useToast } from "@/components/providers/ToastProvider";

const providers = [
  {
    name: "Google",
    glyph: (
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z" />
        <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21 7.6 23.5 12 23.5Z" />
        <path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z" />
        <path fill="#EA4335" d="M12 5.2c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.8l3.8 3c.9-2.7 3.4-4.6 6.4-4.6Z" />
      </svg>
    ),
  },
  {
    name: "Apple",
    glyph: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.6.9-.7 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.9 2.4-1.6 2.9-.4 7.1 1.2 9.4.8 1.1 1.7 2.4 2.9 2.4 1.2 0 1.6-.8 3-.8s1.8.8 3 .7c1.2 0 2-1.1 2.8-2.3.9-1.3 1.2-2.6 1.3-2.6-.1 0-2.4-.9-2.4-3.6ZM14.2 5.5c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.9 1 0 2-.5 2.7-1.3Z" />
      </svg>
    ),
  },
];

export function SocialRow() {
  const { toast } = useToast();

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--color-ink)_10%,transparent)]" />
        <span className="text-xs font-medium text-ink-faint">or continue with</span>
        <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--color-ink)_10%,transparent)]" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {providers.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() =>
              toast(
                "info",
                `${provider.name} sign-in is not wired up`,
                "Use a demo account below to explore the platform.",
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border hairline bg-white text-sm font-semibold text-ink transition-colors hover:border-electric/50"
          >
            {provider.glyph}
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}
