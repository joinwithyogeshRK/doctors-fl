"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarPlus, ChevronDown, Menu, Search, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "@/lib/format";
import { useScrolled } from "@/hooks/useScrolled";
import { useActiveSection } from "@/hooks/useActiveSection";
import { homeSectionIds, navItems } from "@/components/layout/navItems";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { CartButton } from "@/components/layout/CartButton";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { DemoMenu } from "@/components/layout/DemoMenu";

export function SiteHeader() {
  const scrolled = useScrolled(20);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(isHome ? homeSectionIds : []);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = scrolled || !isHome;

  const isActive = (item: (typeof navItems)[number]) => {
    if (isHome && item.sectionId) {
      if (item.sectionId === "top") return activeSection === "top" || activeSection === null;
      return activeSection === item.sectionId;
    }
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  };

  const hrefFor = (item: (typeof navItems)[number]) =>
    isHome && item.sectionId && item.sectionId !== "top" ? `#${item.sectionId}` : item.href;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        solid
          ? "border-b border-[color-mix(in_oklab,var(--color-ink)_7%,transparent)] bg-white/85 shadow-[0_1px_0_rgb(255_255_255/0.6),0_10px_30px_-24px_rgb(10_26_60/0.5)] backdrop-blur-xl"
          : "bg-transparent",
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="shell flex h-18 items-center gap-4 py-3">
        <Logo />

        <nav className="ml-auto hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {navItems
            .filter((item) => item.href !== "/")
            .map((item) => {
            const active = isActive(item);
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={hrefFor(item)}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-electric" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className={cx(
                    "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    active || openMenu === item.label
                      ? "text-electric"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={cx(
                      "transition-transform duration-200",
                      openMenu === item.label && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {openMenu === item.label && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className={cx(
                        "absolute top-full left-1/2 -translate-x-1/2 pt-3",
                        item.children.length > 6 ? "w-[34rem]" : "w-72",
                      )}
                    >
                      <div className="glass rounded-card p-2">
                        <div
                          className={cx(
                            "grid gap-0.5",
                            item.children.length > 6 ? "grid-cols-2" : "grid-cols-1",
                          )}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-ice"
                            >
                              <span className="font-medium text-ink">{child.label}</span>
                              {child.hint && (
                                <span className="text-xs text-ink-faint">{child.hint}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="mt-1 block rounded-xl bg-ice px-3 py-2.5 text-sm font-semibold text-electric transition-colors hover:bg-ice-deep"
                        >
                          View all {item.label.toLowerCase()}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-4">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice hover:text-ink"
          >
            <Search size={18} />
          </Link>
          <CartButton />
          <div className="hidden sm:block">
            <NotificationBell />
          </div>
          <DemoMenu />
          <Link
            href="/auth/login"
            aria-label="Sign in"
            title="Sign in"
            className="hidden h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice hover:text-ink lg:grid"
          >
            <UserRound size={18} />
          </Link>
          <div className="hidden lg:block">
            <ButtonLink href="/appointments/book" size="sm">
              <CalendarPlus size={15} />
              Book appointment
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ice xl:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileSheet onClose={() => setMobileOpen(false)} pathname={pathname} />
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileSheet({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      className="fixed inset-0 z-50 xl:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        initial={reduce ? { opacity: 0 } : { x: "100%" }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: "100%" }}
        transition={{ type: "spring", stiffness: 360, damping: 38 }}
        className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-white shadow-float"
      >
        <div className="flex items-center justify-between border-b hairline px-5 py-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={cx(
                    "block rounded-xl px-4 py-3 text-[0.9375rem] font-medium transition-colors",
                    active ? "bg-ice text-electric" : "text-ink hover:bg-mist",
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            const isOpen = expanded === item.label;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-mist"
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={cx("text-ink-faint transition-transform duration-200", isOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className="block rounded-lg py-2.5 pr-4 pl-7 text-sm text-ink-soft transition-colors hover:bg-mist hover:text-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="space-y-2 border-t hairline px-5 py-4">
          <ButtonLink href="/appointments/book" className="w-full" onClick={onClose}>
            <CalendarPlus size={16} />
            Book appointment
          </ButtonLink>
          <ButtonLink href="/auth/login" variant="secondary" className="w-full" onClick={onClose}>
            <UserRound size={16} />
            Sign in
          </ButtonLink>
        </div>
      </motion.div>
    </motion.div>
  );
}
