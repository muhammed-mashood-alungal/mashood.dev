"use client";

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import type { SkillCategory } from "@/content/site";

/** Time to read a category: a short base plus a little per skill. */
function readingTime(category: SkillCategory) {
  return 1500 + category.skills.length * 700;
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(reducedMotionQuery);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    // On the server, assume reduced motion so nothing animates before hydration.
    () => true,
  );
}

/**
 * Skill categories drawn as a singly linked list. Each node is a disclosure
 * button; every panel stays in the DOM so the full skill list is crawlable.
 *
 * The active node advances on its own after a reading time based on how many
 * skills it holds. It pauses while keyboard focus is inside or the list is
 * off-screen, and stops once the visitor picks a node themselves.
 */
export function SkillsList({ categories }: { categories: SkillCategory[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(categories[0]?.id ?? null);
  const [autoplay, setAutoplay] = useState(true);
  const [inView, setInView] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.4,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const canAutoplay = autoplay && !reducedMotion;
  const running = canAutoplay && inView && !focused && activeId !== null;

  function advance() {
    const index = categories.findIndex((c) => c.id === activeId);
    setActiveId(categories[(index + 1) % categories.length].id);
  }

  function select(id: string) {
    setAutoplay(false);
    setActiveId((current) => (current === id ? null : id));
  }

  function toggleAutoplay() {
    if (!autoplay && activeId === null) setActiveId(categories[0].id);
    setAutoplay((on) => !on);
  }

  return (
    <div
      ref={rootRef}
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <ol aria-label="Skill categories" className="flex flex-wrap items-center gap-y-2">
        {categories.map((category, i) => {
          const active = category.id === activeId;
          const isLast = i === categories.length - 1;
          return (
            <Fragment key={category.id}>
              <li className="flex items-center">
                <button
                  type="button"
                  id={`skill-node-${category.id}`}
                  aria-expanded={active}
                  aria-controls={`skill-panel-${category.id}`}
                  onClick={() => select(category.id)}
                  className={`relative inline-flex min-h-11 items-center overflow-hidden rounded-lg border bg-surface px-3 text-sm transition-colors ${
                    active
                      ? "border-accent text-fg"
                      : "border-border text-muted hover:border-muted hover:text-fg"
                  }`}
                >
                  {category.name}
                  <span
                    aria-hidden
                    className="ml-2 font-mono text-[11px] text-muted tabular-nums"
                  >
                    {category.skills.length}
                  </span>
                  {active && canAutoplay && (
                    <span
                      key={category.id}
                      aria-hidden
                      onAnimationEnd={advance}
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent/70"
                      style={{
                        animation: `skill-progress ${readingTime(category)}ms linear forwards`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                    />
                  )}
                </button>
                <Arrow />
              </li>
              {isLast && (
                <li aria-hidden className="font-mono text-sm text-muted">
                  null
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>

      <div className="mt-6">
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <div
              key={category.id}
              id={`skill-panel-${category.id}`}
              role="region"
              aria-labelledby={`skill-node-${category.id}`}
              inert={!active}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="rounded-card border border-border bg-surface p-5">
                  <p className="mb-3 font-mono text-xs text-muted">
                    {category.name.toLowerCase()}.skills
                  </p>
                  <StackList skills={category.skills} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!reducedMotion && (
        <button
          type="button"
          onClick={toggleAutoplay}
          aria-pressed={autoplay}
          className="mt-2 -ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-mono text-xs text-muted transition-colors hover:text-fg"
        >
          {autoplay ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />}
          {autoplay ? "pause auto-advance" : "resume auto-advance"}
        </button>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="px-2 font-mono text-sm text-muted">
      →
    </span>
  );
}

/** Skills as a vertical stack. */
function StackList({ skills }: { skills: string[] }) {
  return (
    <ul className="flex w-full max-w-48 flex-col gap-1">
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-md border border-border px-2.5 py-0.5 text-sm"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
