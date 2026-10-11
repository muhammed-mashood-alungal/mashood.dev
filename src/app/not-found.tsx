import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto max-w-5xl px-5 pt-20 outline-none sm:px-8 sm:pt-28"
    >
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">
        This page doesn&apos;t exist, or it moved. The rest of the site is one page away.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center text-accent transition-colors hover:text-accent-hover"
      >
        ← Back to home
      </Link>
    </main>
  );
}
