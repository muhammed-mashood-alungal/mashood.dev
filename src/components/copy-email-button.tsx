"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); the mailto
      // link next to this button still works.
    }
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-muted hover:text-fg"
      >
        {copied ? (
          <Check size={16} aria-hidden className="text-accent" />
        ) : (
          <Copy size={16} aria-hidden />
        )}
        Copy<span className="sr-only"> email address</span>
      </button>
      <span
        role="status"
        className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-border bg-surface px-2 py-1 text-xs whitespace-nowrap transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
