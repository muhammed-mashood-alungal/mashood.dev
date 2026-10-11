"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Copy, FileText, Hash, Mail, Search } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/lib/command-palette";
import { BrandIcon } from "./icons";

export type PaletteConfig = {
  email: string;
  whatsapp: string;
  github: string;
  leetcode: string;
  linkedin: string;
  resume: string;
  sections: { id: string; label: string }[];
};

type Command = {
  id: string;
  label: string;
  group: "Actions" | "Go to";
  icon: ReactNode;
  /** Keep the palette open briefly and show the returned message (e.g. "Copied"). */
  feedback?: boolean;
  run: () => void | Promise<string>;
};

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function goToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  history.pushState(null, "", `#${id}`);
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  el.focus({ preventScroll: true });
}

const iconProps = { size: 16, "aria-hidden": true } as const;

export function CommandPalette({ config }: { config: PaletteConfig }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const listId = useId();

  const commands = useMemo<Command[]>(
    () => [
      {
        id: "copy-email",
        label: "Copy email",
        group: "Actions",
        icon: <Copy {...iconProps} />,
        feedback: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(config.email);
            return "Copied";
          } catch {
            return "Copy failed";
          }
        },
      },
      {
        id: "send-email",
        label: "Send email",
        group: "Actions",
        icon: <Mail {...iconProps} />,
        run: () => {
          window.location.href = `mailto:${config.email}`;
        },
      },
      {
        id: "whatsapp",
        label: "Open WhatsApp",
        group: "Actions",
        icon: <BrandIcon name="whatsapp" className="size-4" />,
        run: () => openExternal(config.whatsapp),
      },
      {
        id: "github",
        label: "Open GitHub",
        group: "Actions",
        icon: <BrandIcon name="github" className="size-4" />,
        run: () => openExternal(config.github),
      },
      {
        id: "leetcode",
        label: "Open LeetCode",
        group: "Actions",
        icon: <BrandIcon name="leetcode" className="size-4" />,
        run: () => openExternal(config.leetcode),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Actions",
        icon: <BrandIcon name="linkedin" className="size-4" />,
        run: () => openExternal(config.linkedin),
      },
      {
        id: "resume",
        label: "Download resume",
        group: "Actions",
        icon: <FileText {...iconProps} />,
        run: () => openExternal(config.resume),
      },
      ...config.sections.map<Command>((section) => ({
        id: `section-${section.id}`,
        label: section.label,
        group: "Go to",
        icon: <Hash {...iconProps} />,
        run: () => goToSection(section.id),
      })),
    ],
    [config],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
    );
  }, [commands, query]);

  const show = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setNotice("");
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    // Close synchronously so the dialog restores focus before any command
    // moves focus elsewhere (e.g. to a section).
    dialogRef.current?.close();
    setOpen(false);
  }, []);

  // Global shortcut and the custom event fired by the nav button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, [show, close]);

  // Sync the native dialog with state and lock page scroll while open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  async function runCommand(command: Command | undefined) {
    if (!command) return;
    if (command.feedback) {
      setNotice((await command.run()) ?? "");
      setTimeout(close, 700);
    } else {
      close();
      void command.run();
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) =>
          filtered.length ? (i - 1 + filtered.length) % filtered.length : 0,
        );
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(Math.max(filtered.length - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        void runCommand(filtered[activeIndex]);
        break;
      case "Tab":
        // The input is the only focusable element; keep focus inside.
        e.preventDefault();
        break;
    }
  }

  const optionId = (index: number) => `${listId}-option-${index}`;
  let lastGroup: Command["group"] | null = null;

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClose={close}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
      onKeyDown={onKeyDown}
      className="m-0 mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-md rounded-card border border-border bg-surface p-0 text-fg shadow-2xl shadow-black/50"
    >
      {open && (
        <>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search size={16} aria-hidden className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={filtered.length ? optionId(activeIndex) : undefined}
              aria-label="Search commands"
              placeholder="Type a command or search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-muted"
            />
            <kbd className="rounded border border-border px-1.5 font-mono text-[10px] text-muted">
              esc
            </kbd>
          </div>

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Commands"
            className="max-h-[min(60vh,24rem)] scroll-py-2 overflow-y-auto overscroll-contain p-2"
          >
            {filtered.length === 0 && (
              <li
                role="presentation"
                className="px-3 py-6 text-center text-sm text-muted"
              >
                No results
              </li>
            )}
            {filtered.map((command, index) => {
              const showGroup = command.group !== lastGroup;
              lastGroup = command.group;
              const active = index === activeIndex;
              return (
                <li key={command.id} role="presentation">
                  {showGroup && (
                    <div
                      role="presentation"
                      className="px-3 pt-2 pb-1 font-mono text-[11px] text-muted"
                    >
                      {command.group}
                    </div>
                  )}
                  <div
                    id={optionId(index)}
                    role="option"
                    aria-selected={active}
                    data-index={index}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => void runCommand(command)}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-sm ${
                      active ? "bg-border text-fg" : "text-muted"
                    }`}
                  >
                    <span className={active ? "text-accent" : ""}>{command.icon}</span>
                    {command.label}
                    {active && (
                      <ArrowRight size={14} aria-hidden className="ml-auto text-muted" />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <p
            role="status"
            className="border-t border-border px-4 py-2 font-mono text-[11px] text-muted"
          >
            {notice || "↑↓ to move · enter to run"}
          </p>
        </>
      )}
    </dialog>
  );
}
