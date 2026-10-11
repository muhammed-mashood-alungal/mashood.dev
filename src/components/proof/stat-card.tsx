import type { ReactNode } from "react";
import type { SocialKey } from "@/content/site";
import { site } from "@/content/site";
import { BrandIcon } from "../icons";

type StatCardProps = {
  network: Extract<SocialKey, "github" | "leetcode">;
  children: ReactNode;
  className?: string;
};

/** Shared frame for the GitHub and LeetCode cards, including the footer link. */
export function StatCard({ network, children, className }: StatCardProps) {
  const link = site.socials[network];
  const titleId = `${network}-card-title`;
  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={`flex min-w-0 flex-col rounded-card border border-border bg-surface p-5 ${className ?? ""}`}
    >
      <h3 id={titleId} className="flex items-center gap-2 font-medium">
        <BrandIcon name={network} className="size-4 text-muted" />
        {link.label}
      </h3>
      <div className="mt-4 flex-1">{children}</div>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 -mb-2 inline-flex min-h-11 items-center self-start text-sm text-accent transition-colors hover:text-accent-hover"
      >
        View {link.label} →<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}

export function StatsUnavailable() {
  return <p className="text-sm text-muted">Stats unavailable right now.</p>;
}

/** Placeholder block for Suspense fallbacks. */
export function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded bg-border/70 ${className ?? ""}`}
    />
  );
}
