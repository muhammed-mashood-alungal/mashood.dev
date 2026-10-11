"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu, Search, X } from "lucide-react";
import { site } from "@/content/site";
import { openCommandPalette } from "@/lib/command-palette";

const noopSubscribe = () => () => {};

/** "⌘K" on Apple devices, "Ctrl K" elsewhere (and during server render). */
function useShortcutLabel() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => "Ctrl K",
  );
}

export function SiteHeader() {
  const shortcut = useShortcutLabel();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        solid ? "border-border bg-bg/90" : "border-transparent bg-bg/0"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#top"
          className="-ml-2 inline-flex min-h-11 items-center rounded-lg px-2 font-medium transition-colors hover:text-accent"
        >
          {site.name}
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center sm:flex">
            {site.nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-[0.9375rem] text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={openCommandPalette}
            aria-keyshortcuts="Meta+K Control+K"
            title={`Quick actions (${shortcut})`}
            className="group ml-2 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-muted hover:text-fg"
          >
            <Search size={15} aria-hidden />
            <span className="sr-only md:not-sr-only">Quick actions</span>
            <kbd
              aria-hidden
              className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted transition-colors group-hover:border-muted lg:inline-block"
            >
              {shortcut}
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-fg sm:hidden"
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-border sm:hidden"
      >
        <ul className="mx-auto max-w-5xl px-3 py-2">
          {site.nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-2 text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
