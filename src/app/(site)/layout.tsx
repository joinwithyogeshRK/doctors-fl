import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWidgets } from "@/components/layout/FloatingWidgets";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-electric focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Suspense fallback={<div className="fixed inset-x-0 top-0 z-50 h-18" />}>
        <SiteHeader />
      </Suspense>
      <main id="main">{children}</main>
      <SiteFooter />
      <FloatingWidgets />
    </>
  );
}
