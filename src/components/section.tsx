import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

/** A landmark section with an h2, used for every block below the hero. */
export function Section({ id, title, children, className }: SectionProps) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      data-reveal
      className={`outline-none ${className ?? ""}`}
    >
      <h2 id={titleId} className="mb-6 text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="rounded-md border border-border px-2 py-0.5 font-mono text-xs leading-5 text-muted">
      {children}
    </li>
  );
}

export function TagList({ tags, label }: { tags: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}
